import { useState, useEffect, useRef } from 'react'
import { db, auth } from "../../Firebase/db"
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'
import { Link } from 'react-router-dom'
const HR_Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    title: 'Edit your job title',
    company: 'Edit your company name',
    profilePic: null,
    companyLogo: null,
    linkedin: "",
    period: 'May 2023 - Present',
    about: 'Enter your about.'
  })
  const [editData, setEditData] = useState({
    name: '',
    title: '',
    company: '',
    profilePic: null,
    companyLogo: null,
    linkedin: "",
    period: '',
    about: ''
  })

  const profilePicRef = useRef(null)
  const companyLogoRef = useRef(null)
  const [imageUploading, setImageUploading] = useState({
    profilePic: false,
    companyLogo: false
  })

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log('Auth state changed:', currentUser?.uid)
      setUser(currentUser)
      setAuthChecked(true)
      
      if (currentUser) {
        loadProfileData(currentUser.uid)
      } else {
        // Try to get UID from localStorage as fallback
        const storedUID = localStorage.getItem('uid')
        if (storedUID && storedUID !== 'null' && storedUID !== 'undefined') {
          console.log('Using stored UID:', storedUID)
          setUser({ uid: storedUID })
          loadProfileData(storedUID)
        } else {
          console.log('No user authenticated, should redirect to login')
        }
      }
    })

    return () => unsubscribe()
  }, [])

  const loadProfileData = async (uid) => {
    if (!uid) {
      console.error('No UID provided')
      return
    }

    try {
      setLoading(true)
      console.log('Loading profile data for UID:', uid)
      
      const userName = localStorage.getItem("userName") || ''
      
      // First check if profile exists in hrProfiles collection
      let docRef = doc(db, 'hrProfiles', uid)
      let docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        console.log('Found existing HR profile')
        const data = docSnap.data()
        setProfileData(data)
        setEditData(data)
      } else {
        console.log('No HR profile found, checking hr_users collection')
        // If no profile exists, get HR data from hr_users collection
        const hrUserRef = doc(db, 'hr_users', uid)
        const hrUserSnap = await getDoc(hrUserRef)
        
        let defaultData = {
          name: userName || '',
          title: 'Edit your job title',
          company: 'Edit your company name',
          profilePic: null,
          companyLogo: null,
          linkedin: "",
          period: 'May 2023 - Present',
          about: 'Enter your about.'
        }

        // If HR user data exists, use it to populate defaults
        if (hrUserSnap.exists()) {
          console.log('Found HR user data')
          const hrData = hrUserSnap.data()
          defaultData = {
            ...defaultData,
            name: hrData.profileName || hrData.email || userName || '',
            company: hrData.companyName || 'Edit your company name',
            linkedin: hrData.linkedin || '',
            title: 'HR Professional'
          }
        } else {
          console.log('No HR user data found, using defaults')
        }

        setProfileData(defaultData)
        setEditData(defaultData)
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      
      if (error.code === 'permission-denied') {
        console.error('Permission denied. Check Firestore security rules.')
        alert('Permission denied. Please ensure you are properly authenticated.')
      }
      

      const userName = localStorage.getItem("userName") || ''
      const defaultData = {
        name: userName || 'HR User',
        title: 'Edit your job title',
        company: 'Edit your company name',
        profilePic: null,
        companyLogo: null,
        linkedin: "",
        period: 'May 2023 - Present',
        about: 'Enter your about.'
      }
      setProfileData(defaultData)
      setEditData(defaultData)
    } finally {
      setLoading(false)
    }
  }

  const compressImage = (file, maxWidth = 300, maxHeight = 300, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        let { width, height } = img
        const aspectRatio = width / height
        
        if (width > height) {
          if (width > maxWidth) {
            width = maxWidth
            height = width / aspectRatio
          }
        } else {
          if (height > maxHeight) {
            height = maxHeight
            width = height * aspectRatio
          }
        }
        
        if (width > maxWidth) {
          width = maxWidth
          height = width / aspectRatio
        }
        if (height > maxHeight) {
          height = maxHeight
          width = height * aspectRatio
        }
        
        canvas.width = width
        canvas.height = height

        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
        
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
        
        const sizeInBytes = Math.round((compressedBase64.length * 3) / 4)
        const sizeInKB = sizeInBytes / 1024
        
        console.log(`Compressed image: ${sizeInKB.toFixed(2)}KB`)
        
        if (sizeInKB > 500) {
          const newQuality = Math.max(0.3, quality - 0.2)
          resolve(compressImage(file, maxWidth * 0.8, maxHeight * 0.8, newQuality))
        } else {
          resolve(compressedBase64)
        }
      }
      
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleSave = async () => {
    const uid = user?.uid || localStorage.getItem('uid')
    
    if (!uid || uid === 'null' || uid === 'undefined') {
      alert('User not authenticated. Please log in again.')
      return
    }

    try {
      setLoading(true)
      console.log('Saving profile for UID:', uid)
      let updatedData = { ...editData }
      updatedData.updatedAt = new Date()
      updatedData.lastModified = Date.now()
      console.log('Data to save:', {
        ...updatedData,
        profilePic: updatedData.profilePic ? '[Base64 Image Data]' : null,
        companyLogo: updatedData.companyLogo ? '[Base64 Image Data]' : null
      })

      const docRef = doc(db, 'hrProfiles', uid)
      await setDoc(docRef, updatedData, { merge: true })

      setProfileData(updatedData)
      setIsEditing(false)
      
      console.log('Profile saved successfully!')
      alert('Profile saved successfully!')
    } catch (error) {
      console.error('Error saving profile:', error)
      
      if (error.code === 'permission-denied') {
        alert('Permission denied. Please ensure you are properly authenticated.')
      } else if (error.code === 'unauthenticated') {
        alert('Authentication required. Please log in again.')
      } else if (error.message.includes('document too large')) {
        alert('Images are too large. Please use smaller images.')
      } else {
        alert('Failed to save profile: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditData(profileData)
    setIsEditing(false)
    setImageUploading({ profilePic: false, companyLogo: false })
  }

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0]
    if (!file) return

   
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    try {
     
      setImageUploading(prev => ({ ...prev, [type]: true }))
  
      setEditData(prev => ({
        ...prev,
        [type]: 'loading'
      }))

      
      let maxWidth, maxHeight, quality
      if (type === 'profilePic') {
        maxWidth = 300
        maxHeight = 300
        quality = 0.8
      } else if (type === 'companyLogo') {
        maxWidth = 200
        maxHeight = 200
        quality = 0.9
      }

      console.log(`Compressing ${type}...`)
      const compressedBase64 = await compressImage(file, maxWidth, maxHeight, quality)
 
      setEditData(prev => ({
        ...prev,
        [type]: compressedBase64
      }))

      console.log(`${type} compressed and ready`)
    } catch (error) {
      console.error('Error processing image:', error)
      alert('Failed to process image. Please try again.')
      

      setEditData(prev => ({
        ...prev,
        [type]: profileData[type]
      }))
    } finally {
      setImageUploading(prev => ({ ...prev, [type]: false }))
    }
  }

  const getInitials = (name) => {
    if (!name) return 'HR'
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const uid = user?.uid || localStorage.getItem('uid')
  if (!uid || uid === 'null' || uid === 'undefined') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please log in to access your profile.</p>
          <button 
            onClick={() => {
              localStorage.clear()
              window.location.href = '/login'
            }}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading && isEditing ? 'Saving profile...' : 'Loading profile...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    
    <div className="min-h-screen bg-gray-50">
    <div className="flex items-center justify-end pt-2 px-5">
      <Link
        to="/hr-dashboard"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-md"
      >
        GO to Dashboard
      </Link>
    </div>
      <div className="max-w-md mx-auto bg-white rounded-3xl overflow-hidden shadow-lg">
        <div className="px-8 pt-8 pb-4 bg-gradient-to-b from-blue-50 to-white">
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-white shadow-lg overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                {profileData.profilePic ? (
                  <img 
                    src={profileData.profilePic} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="text-2xl font-bold text-white">
                    {getInitials(profileData.name || localStorage.getItem("userName"))}
                  </div>
                )}
              </div>
            </div>

            <h1 className="text-xl font-bold text-gray-800 mb-2">
              {profileData.name || localStorage.getItem("userName") || 'HR User'}
            </h1>
            <p className="text-blue-600 text-sm mb-1 font-medium">{profileData.title}</p>
            <p className="text-gray-600 text-sm">{profileData.company}</p>
          </div>
        </div>

        <div className="px-8 py-2">
          <button
            onClick={handleEditProfile}
            className="w-full bg-blue-500 cursor-pointer text-white py-1 rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-md"
          >
            Edit Profile
          </button>
        </div>

        <div className="px-8 py-4 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">About</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            {profileData.about}
          </p>
        </div>

      
        <div className="px-8 py-4 border-t border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Company</h2>
          <div className="flex items-start gap-3">
           
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
              {profileData.companyLogo ? (
                <img 
                  src={profileData.companyLogo} 
                  alt="Company Logo" 
                  className="w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-6 h-6 bg-blue-200 rounded"></div>
              )}
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{profileData.company}</h3>
              <p className="text-sm text-gray-600">{profileData.title}</p>
              <p className="text-sm text-gray-500">{profileData.period}</p>
            </div>
          </div>
        </div>

       
        <div className="px-8 py-4 border-t border-gray-100 mb-4">
          <Link to={profileData.linkedin} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">in</span>
              </div>
              <span className="text-sm text-gray-600">LinkedIn</span>
            </div>
          </Link>
        </div>
      </div>

    
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Edit Profile</h2>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 cursor-pointer hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>

             
              <div className="mb-6 text-center">
                <div className="relative inline-block">
                  <div 
                    className="w-20 h-20 rounded-full cursor-pointer border-4 border-gray-300 shadow-lg overflow-hidden bg-gray-200 flex items-center justify-center mx-auto hover:border-blue-400 transition-colors"
                    onClick={() => profilePicRef.current?.click()}
                  >
                    {imageUploading.profilePic ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    ) : editData.profilePic && editData.profilePic !== 'loading' ? (
                      <img 
                        src={editData.profilePic} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : editData.profilePic === 'loading' ? (
                      <div className="animate-pulse bg-gray-300 w-full h-full"></div>
                    ) : (
                      <div className="text-xl font-bold text-gray-600">
                        {getInitials(editData.name || localStorage.getItem("userName") || 'HR')}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <div className="bg-blue-500 text-white rounded-full p-1 text-xs shadow-md">
                      📷
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Click to upload profile picture</p>
                <p className="text-xs text-gray-400">Max 5MB, will be optimized automatically</p>
                <input
                  type="file"
                  ref={profilePicRef}
                  onChange={(e) => handleFileUpload(e, 'profilePic')}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={editData.name || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-50  transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                  <input
                    type="text"
                    value={editData.title || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-50  transition-colors"
                    placeholder="Enter your job title"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={editData.company || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, company: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-50  transition-colors"
                    placeholder="Enter company name"
                  />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>LinkedIn</label>
                  <input
                    type="text"
                    value={editData.linkedin || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, linkedin: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-50  transition-colors"
                    placeholder="Enter LinkedIn profile URL"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Work Period</label>
                  <input
                    type="text"
                    value={editData.period || ''}
                    onChange={(e) => setEditData(prev => ({ ...prev, period: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-50  transition-colors"
                    placeholder="e.g., May 2023 - Present"
                  />
                </div>

              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">About</label>
                <textarea
                  value={editData.about || ''}
                  onChange={(e) => setEditData(prev => ({ ...prev, about: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-50  transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                <div 
                  className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer border-2 border-dashed border-gray-300 hover:bg-gray-50 hover:border-blue-400 transition-colors"
                  onClick={() => companyLogoRef.current?.click()}
                >
                  {imageUploading.companyLogo ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  ) : editData.companyLogo && editData.companyLogo !== 'loading' ? (
                    <img 
                      src={editData.companyLogo} 
                      alt="Company Logo" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : editData.companyLogo === 'loading' ? (
                    <div className="animate-pulse bg-gray-300 w-12 h-12 rounded"></div>
                  ) : (
                    <span className="text-xs text-gray-500">Upload Logo</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-1">Click to upload company logo</p>
                <input
                  type="file"
                  ref={companyLogoRef}
                  onChange={(e) => handleFileUpload(e, 'companyLogo')}
                  accept="image/*"
                  className="hidden"
                />
              </div>

         
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={loading || imageUploading.profilePic || imageUploading.companyLogo}
                  className="flex-1 bg-blue-500 cursor-pointer text-white py-2 rounded-xl font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2 cursor-pointer">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </div>
                  ) : 'Save'}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 bg-gray-300 cursor-pointer text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-400 transition-colors disabled:opacity-50 shadow-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default HR_Profile