import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { db, auth } from "../../Firebase/db";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};


const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

const HR_Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    title: "Edit your job title",
    company: "Edit your company name",
    profilePic: null,
    companyLogo: null,
    linkedin: "",
    period: "May 2023 - Present",
    about: "Edit your about.",
  });
  const [editData, setEditData] = useState({
    name: "",
    title: "",
    company: "",
    profilePic: null,
    companyLogo: null,
    linkedin: "",
    period: "",
    about: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [showValidation, setShowValidation] = useState(false);

  const profilePicRef = useRef(null);
  const companyLogoRef = useRef(null);
  const [imageUploading, setImageUploading] = useState({
    profilePic: false,
    companyLogo: false,
  });
  const debouncedEditData = useDebounce(editData, 300);
  const validateField = useCallback((name, value) => {
    const errors = {};

    switch (name) {
      case "name":
        if (!value || !value.trim()) {
          errors.name = "Name is required";
        } else if (value.trim().length < 2) {
          errors.name = "Name must be at least 2 characters";
        } else if (value.trim().length > 50) {
          errors.name = "Name must be less than 50 characters";
        }
        break;

      case "title":
        if (!value || !value.trim()) {
          errors.title = "Job title is required";
        } else if (value.trim().length < 2) {
          errors.title = "Job title must be at least 2 characters";
        } else if (value.trim().length > 100) {
          errors.title = "Job title must be less than 100 characters";
        }
        break;

      case "company":
        if (!value || !value.trim()) {
          errors.company = "Company name is required";
        } else if (value.trim().length < 2) {
          errors.company = "Company name must be at least 2 characters";
        } else if (value.trim().length > 100) {
          errors.company = "Company name must be less than 100 characters";
        }
        break;
              case "linkedin":
        if (!value || !value.trim()) {
          errors.linkedin = "LinkedIn profile is required";
        } else {
          const trimmedValue = value.trim();

          const isLinkedInUrl = trimmedValue
            .toLowerCase()
            .includes("linkedin.com");
          if (!isLinkedInUrl) {
            errors.linkedin = "Please enter a LinkedIn URL";
          }
        }
        break;

      case "period":
        if (!value || !value.trim()) {
          errors.period = "Work period is required";
        } else if (value.trim().length < 5) {
          errors.period = "Please enter a valid work period";
        } else if (value.trim().length > 50) {
          errors.period = "Work period must be less than 50 characters";
        }
        break;

      case "about":
        if (!value || !value.trim()) {
          errors.about = "About section is required";
        } else if (value.trim().length < 10) {
          errors.about = "About section must be at least 10 characters";
        } else if (value.trim().length > 500) {
          errors.about = "About section must be less than 500 characters";
        }
        break;
      case "profilePic":
        if (!value || value === "loading" || value === null || value === "") {
          errors.profilePic = "Profile picture is required";
        } else if (
          typeof value === "string" &&
          value.startsWith("data:image/")
        ) {
   
        } else {
          errors.profilePic = "Invalid profile picture format";
        }
        break;

      case "companyLogo":
    
        if (!value || value === "loading" || value === null || value === "") {
          errors.companyLogo = "Company logo is required";
        } else if (
          typeof value === "string" &&
          value.startsWith("data:image/")
        ) {
        
        } else {
          errors.companyLogo = "Invalid company logo format";
        }
        break;
    }

    return errors;
  }, []);

  const validateAllFields = useCallback(
    (data) => {
      let allErrors = {};


      const fieldsToValidate = [
        "name",
        "title",
        "company",
        "linkedin",
        "period",
        "about",
        "profilePic",
        "companyLogo",
      ];

      fieldsToValidate.forEach((field) => {
        const fieldErrors = validateField(field, data[field]);
        allErrors = { ...allErrors, ...fieldErrors };
      });

      return allErrors;
    },
    [validateField]
  );

  const isFormValid = useMemo(() => {
    const errors = validateAllFields(editData);
    return Object.keys(errors).length === 0;
  }, [editData, validateAllFields]);

  useEffect(() => {
    const errors = validateAllFields(editData);
    setValidationErrors(errors);
  }, [editData, validateAllFields]);


  const clearUserData = useCallback(() => {
    const defaultData = {
      name: "",
      title: "Edit your job title",
      company: "Edit your company name",
      profilePic: null,
      companyLogo: null,
      linkedin: "",
      period: "May 2023 - Present",
      about: "Enter your about.",
    };
    setProfileData(defaultData);
    setEditData(defaultData);
    setIsEditing(false);
    setImageUploading({ profilePic: false, companyLogo: false });
    setValidationErrors({});
    setShowValidation(false);
  }, []);

 
  const compressImage = useCallback(async (file, maxSizeKB = 100) => {
    return new Promise((resolve, reject) => {
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, or WebP)");
        reject(new Error("Invalid file type"));
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File must be smaller than 10MB");
        reject(new Error("File too large"));
        return;
      }
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          toast.error("Image must be at least 100x100 pixels");
          reject(new Error("Image too small"));
          return;
        }

        const reader = new FileReader();

        reader.onload = (event) => {
          const canvas = document.createElement("canvas");
          let { width, height } = img;

          const maxDimension = width > height ? width : height;
          if (maxDimension > 1200) {
            const ratio = 1200 / maxDimension;
            width *= ratio;
            height *= ratio;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
          let format = "image/webp";
          let quality = 0.85;
          let base64 = canvas.toDataURL(format, quality)
          if (
            !base64.startsWith("data:image/webp") ||
            base64.length / 1024 > maxSizeKB
          ) {
            format = "image/jpeg";
            quality = 0.8;
            base64 = canvas.toDataURL(format, quality);
            while (base64.length / 1024 > maxSizeKB && quality > 0.3) {
              quality -= 0.05;
              base64 = canvas.toDataURL(format, quality);
            }
          }
          const finalSizeKB = base64.length / 1024;
          if (finalSizeKB > maxSizeKB * 1.5) {
            toast.warn(
              `Image compressed to ${Math.round(
                finalSizeKB
              )}KB. Consider using a smaller image for better performance.`
            );
          }

          resolve(base64);
        };

        reader.onerror = () => {
          reject(new Error("File read failed"));
        };

        reader.readAsDataURL(file);
      };

      img.onerror = () => {
        toast.error("Invalid image file. Please try a different file.");
        reject(new Error("Image processing failed"));
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearUserData();
      setUser(currentUser);
      setAuthChecked(true);
      if (currentUser) {
        loadProfileData(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [clearUserData]);

  const loadProfileData = useCallback(async (uid) => {
    if (!uid) {
      toast.error("Authentication required");
      return;
    }

    try {
      setLoading(true);

      const docRef = doc(db, "hrProfiles", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData(data);
        setEditData(data);
        toast.success("Profile loaded successfully", { autoClose: 1500 });
      } else {
        const hrUserRef = doc(db, "hr_users", uid);
        const hrUserSnap = await getDoc(hrUserRef);

        let defaultData = {
          name: "",
          title: "Edit your job title",
          company: "Edit your company name",
          profilePic: null,
          companyLogo: null,
          linkedin: "",
          period: "May 2023 - Present",
          about: "Edit your about.",
        };

        if (hrUserSnap.exists()) {
          const hrData = hrUserSnap.data();
          defaultData = {
            ...defaultData,
            name: hrData.profileName || hrData.email || "",
            company: hrData.companyName || "Edit your company name",
            linkedin: hrData.linkedin || "",
            title: "HR Professional",
          };
        }

        setProfileData(defaultData);
        setEditData(defaultData);
        toast.info("Please complete your profile setup");
      }
    } catch (error) {
      if (error.code === "permission-denied") {
        toast.error("Permission denied. Please check your authentication.");
      } else if (error.code === "unavailable") {
        toast.error("Service temporarily unavailable. Please try again.");
      } else {
        toast.error("Failed to load profile. Please refresh the page.");
      }
      const defaultData = {
        name: "HR User",
        title: "Edit your job title",
        company: "Edit your company name",
        profilePic: null,
        companyLogo: null,
        linkedin: "",
        period: "May 2023 - Present",
        about: "Edit your about.",
      };
      setProfileData(defaultData);
      setEditData(defaultData);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleEditProfile = useCallback(() => {
    setIsEditing(true);
    setShowValidation(false);
    setValidationErrors({});
  }, []);

  const handleSave = useCallback(async () => {
    const uid = user?.uid;

    if (!uid) {
      toast.error("Authentication required. Please log in again.");
      return;
    }

 
    setShowValidation(true);


    const errors = validateAllFields(editData);

    if (Object.keys(errors).length > 0) {
      toast.error("Please fix all validation errors before saving");
      setValidationErrors(errors);
      return;
    }

    try {
      setLoading(true);
      toast.info("Saving profile...", { autoClose: 1000 });

      const updatedData = {
        ...editData,
        name: editData.name.trim(),
        title: editData.title.trim() || "HR Professional",
        company: editData.company.trim().toUpperCase() || "Company Name",
        linkedin: editData.linkedin.trim(),
        period: editData.period.trim(),
        about: editData.about.trim(),
        updatedAt: new Date(),
        lastModified: Date.now(),
        userId: uid,
      };

      const docRef = doc(db, "hrProfiles", uid);
      await setDoc(docRef, updatedData, { merge: true });

      setProfileData(updatedData);
      setIsEditing(false);
      setShowValidation(false);
      setValidationErrors({});

      toast.success("Profile saved successfully!");
    } catch (error) {
      if (error.code === "permission-denied") {
        toast.error("Permission denied. Please check your authentication.");
      } else if (error.code === "unauthenticated") {
        toast.error("Session expired. Please log in again.");
      } else if (error.message?.includes("document too large")) {
        toast.error("Profile data too large. Please use smaller images.");
      } else if (error.code === "unavailable") {
        toast.error("Service temporarily unavailable. Please try again.");
      } else {
        toast.error("Failed to save profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [user?.uid, editData, validateAllFields]);

  const handleCancel = useCallback(() => {
    setEditData(profileData);
    setIsEditing(false);
    setImageUploading({ profilePic: false, companyLogo: false });
    setValidationErrors({});
    setShowValidation(false);
    toast.info("Changes cancelled");
  }, [profileData]);

  const handleInputChange = useCallback(
    (field, value) => {
      setEditData((prev) => ({ ...prev, [field]: value }));


      if (validationErrors[field]) {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    },
    [validationErrors]
  );

  const handleFileUpload = useCallback(
    async (event, type) => {
      const file = event.target.files[0];
      if (!file) return;

      try {
        setImageUploading((prev) => ({ ...prev, [type]: true }));
        setEditData((prev) => ({ ...prev, [type]: "loading" }));

        const compressedBase64 = await compressImage(
          file,
          type === "profilePic" ? 150 : 100
        );

        setEditData((prev) => ({ ...prev, [type]: compressedBase64 }));
        if (validationErrors[type]) {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[type];
            return newErrors;
          });
        }

        toast.success(
          `${
            type === "profilePic" ? "Profile picture" : "Company logo"
          } uploaded successfully!`
        );
      } catch (error) {

        setEditData((prev) => ({ ...prev, [type]: profileData[type] }));
      } finally {
        setImageUploading((prev) => ({ ...prev, [type]: false }));
      }
    },
    [compressImage, profileData, validationErrors]
  );

  const getInitials = useCallback((name) => {
    if (!name) return "HR";
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const LoadingSpinner = useMemo(
    () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            {loading && isEditing ? "Saving profile..." : "Loading profile..."}
          </p>
        </div>
      </div>
    ),
    [loading, isEditing]
  );

  const AuthRequiredMessage = useMemo(
    () => (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg backdrop-blur-sm bg-opacity-90 max-w-md w-full">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to access your profile.
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300 shadow-md"
          >
            Go to Login
          </button>
        </div>
      </div>
    ),
    []
  );

  const ValidationError = ({ error }) =>
    error && showValidation ? (
      <p className="text-red-500 text-xs mt-1">{error}</p>
    ) : null;
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Checking authentication...
          </p>
        </div>
      </div>
    );
  }

  if (!user?.uid) {
    return AuthRequiredMessage;
  }

  if (loading && !isEditing) {
    return LoadingSpinner;
  }

  return (
    <>
      <div className="min-h-screen bg-gray-300 py-8 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mx-auto max-w-full sm:max-w-md md:max-w-lg bg-gray-200 rounded-3xl overflow-hidden shadow-xl backdrop-blur-lg border border-gray-200/50">
            <div className="px-6 pt-8 pb-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="w-28 h-28 rounded-full mx-auto mb-4 border-3 border-white shadow-lg overflow-hidden bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center">
                    {profileData.profilePic ? (
                      <img
                        src={profileData.profilePic}
                        alt="Profile"
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="text-2xl font-bold text-white">
                        {getInitials(profileData.name)}
                      </div>
                    )}
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">
                  {profileData.name || "HR User"}
                </h1>
                <p className="text-gray-900 text-sm mb-1">
                  {profileData.title}
                </p>
                <p className="text-gray-900 text-sm">{profileData.company}</p>
              </div>
            </div>

          
            <div className="px-8 py-4 ">
              <button
                onClick={handleEditProfile}
                className="w-full cursor-pointer bg-gradient-to-br from-blue-500 to-indigo-600 text-white py-1 rounded-2xl font-medium hover:bg-indigo-700 transition-colors duration-300 shadow-md hover:shadow-lg"
              >
                Edit Profile
              </button>
            </div>
            <div className="px-6 py-4 border-t border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                About
              </h2>
              <p className="text-gray-600 text-sm leading-relaxed">
                {profileData.about}
              </p>
            </div>

        
            <div className="px-6 py-4 border-t border-gray-200/50">
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Company
              </h2>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
                  {profileData.companyLogo ? (
                    <img
                      src={profileData.companyLogo}
                      alt="Company Logo"
                      className="w-full h-full object-cover rounded-lg"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-indigo-200 rounded"></div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {profileData.company}
                  </h3>
                  <p className="text-sm text-gray-600">{profileData.title}</p>
                  <p className="text-sm text-gray-500">{profileData.period}</p>
                </div>
              </div>
            </div>
            <div className="spcace p-2">
                {profileData.linkedin && (
                  <Link
                    to={
                      profileData.linkedin.startsWith("http")
                        ? profileData.linkedin
                        : `https://${profileData.linkedin}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-xl  border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all duration-300 group">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                          LinkedIn Profile
                        </h3>
                        <p className="text-sm text-gray-500">
                          View professional profile
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                )}
                </div>
          </div>

       
          {isEditing && (
            <div className="fixed inset-0 bg-gray-700 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-100 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl backdrop-blur-lg border border-gray-200/50">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Edit Profile
                    </h2>
                    <button
                      onClick={handleCancel}
                      className="text-gray-500 cursor-pointer hover:text-gray-700 text-xl transition-colors p-1"
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>

                
                  <div className="mb-6 text-center">
                    <div className="relative inline-block">
                      <div
                        className={`w-20 h-20 rounded-full cursor-pointer border-4 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center mx-auto hover:border-indigo-400 transition-colors duration-300 ${
                          validationErrors.profilePic && showValidation
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                        onClick={() => profilePicRef.current?.click()}
                      >
                        {imageUploading.profilePic ? (
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                        ) : editData.profilePic &&
                          editData.profilePic !== "loading" ? (
                          <img
                            src={editData.profilePic}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : editData.profilePic === "loading" ? (
                          <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                        ) : (
                          <div className="text-xl font-bold text-gray-600">
                            {getInitials(editData.name || "HR")}
                          </div>
                        )}
                      </div>
                      <div className="absolute -bottom-1 -right-1">
                        <div className="bg-indigo-600 text-white rounded-full p-1.5 text-xs shadow-md">
                          📷
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Click to upload profile picture
                    </p>
                    <p className="text-xs text-gray-400">
                      Max 5MB, supports JPEG, PNG, WebP{" "}
                      <span className="text-red-500">(required)</span>
                    </p>
                    <ValidationError error={validationErrors.profilePic} />
                    <input
                      type="file"
                      ref={profilePicRef}
                      onChange={(e) => handleFileUpload(e, "profilePic")}
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      className="hidden"
                    />
                  </div>

            
                  <div className="space-y-4 mb-6">
               
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editData.name || ""}
                        onChange={(e) =>
                          handleInputChange("name", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-100 focus:border-indigo-400 transition-colors ${
                          validationErrors.name && showValidation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your name"
                        required
                      />
                      <ValidationError error={validationErrors.name} />
                    </div>

                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editData.title || ""}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-100 focus:border-indigo-400 transition-colors ${
                          validationErrors.title && showValidation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your job title"
                        required
                      />
                      <ValidationError error={validationErrors.title} />
                    </div>

    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editData.company || ""}
                        onChange={(e) =>
                          handleInputChange("company", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-200 focus:border-indigo-500 transition-colors ${
                          validationErrors.company && showValidation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter company name"
                        required
                      />
                      <ValidationError error={validationErrors.company} />
                    </div>

 
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        LinkedIn Profile <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="url"
                        value={editData.linkedin || ""}
                        onChange={(e) =>
                          handleInputChange("linkedin", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-200 focus:border-indigo-500 transition-colors ${
                          validationErrors.linkedin && showValidation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="https://linkedin.com/in/yourprofile"
                        required
                      />
                      <ValidationError error={validationErrors.linkedin} />
                    </div>

 
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Period <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editData.period || ""}
                        onChange={(e) =>
                          handleInputChange("period", e.target.value)
                        }
                        className={`w-full px-3 py-2 border rounded-lg transition-colors ${
                          validationErrors.period && showValidation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="e.g., May 2023 - Present"
                        required
                      />
                      <ValidationError error={validationErrors.period} />
                    </div>

       
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        About <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={editData.about || ""}
                        onChange={(e) =>
                          handleInputChange("about", e.target.value)
                        }
                        rows={4}
                        maxLength={500}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-indigo-200 focus:border-indigo-500 transition-colors resize-none ${
                          validationErrors.about && showValidation
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Tell us about yourself..."
                        required
                      />
                      <div className="flex justify-between items-center mt-1">
                        <ValidationError error={validationErrors.about} />
                        <p className="text-xs text-gray-400">
                          {editData.about?.length || 0}/500 characters
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Logo <span className="text-red-500">*</span>
                      </label>
                      <div
                        className={`w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed hover:bg-gray-50 hover:border-indigo-400 transition-colors duration-300 ${
                          validationErrors.companyLogo && showValidation
                            ? "border-red-400"
                            : "border-gray-300"
                        }`}
                        onClick={() => companyLogoRef.current?.click()}
                      >
                        {imageUploading.companyLogo ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                        ) : editData.companyLogo &&
                          editData.companyLogo !== "loading" ? (
                          <img
                            src={editData.companyLogo}
                            alt="Company Logo"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : editData.companyLogo === "loading" ? (
                          <div className="animate-pulse bg-gray-300 w-12 h-12 rounded"></div>
                        ) : (
                          <span className="text-xs text-gray-500">
                            Upload Logo
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Click to upload company logo{" "}
                        <span className="text-red-500">(required)</span>
                      </p>
                      <ValidationError error={validationErrors.companyLogo} />
                      <input
                        type="file"
                        ref={companyLogoRef}
                        onChange={(e) => handleFileUpload(e, "companyLogo")}
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        className="hidden"
                      />
                    </div>
                  </div>

                 
                  {showValidation &&
                    Object.keys(validationErrors).length > 0 && (
                      <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-600 text-sm font-medium mb-2">
                          Please fix the following errors:
                        </p>
                        <ul className="text-red-600 text-xs space-y-1">
                          {Object.entries(validationErrors).map(
                            ([field, error]) => (
                              <li key={field}>• {error}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

         
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      disabled={
                        loading ||
                        imageUploading.profilePic ||
                        imageUploading.companyLogo ||
                        !isFormValid
                      }
                      className={`flex-1 py-2 rounded-xl font-medium transition-colors duration-300 shadow-md hover:shadow-lg ${
                        loading ||
                        imageUploading.profilePic ||
                        imageUploading.companyLogo ||
                        !isFormValid
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                      }`}
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </div>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={loading}
                      className="flex-1 bg-gray-200 cursor-pointer text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-300 disabled:opacity-50 shadow-md"
                    >
                      Cancel
                    </button>
                  </div>
                  {!isFormValid && (
                    <div className="mt-3 text-center">
                      <p className="text-xs text-gray-500">
                        Complete all required fields including profile picture
                        and company logo to save
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer {...toastConfig} />
    </>
  );
};

export default HR_Profile;
