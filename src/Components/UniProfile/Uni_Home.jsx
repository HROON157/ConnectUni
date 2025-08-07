import BnuImage from "../../assets/bnu-Logo.png"
import UmtLogo from "../../assets/UMT-Logo.png";
import { Link } from "react-router-dom"
const Uni_Home = () => {
  return (
    <div className='p-4 ml-6 sm:ml-8 md:ml-10 lg:ml-12'>
        <p className='text-xl sm:text-base md:text-lg lg:text-xl ' 
        style={{fontFamily:'Public Sans',fontWeight:'700',fontSize:'32px'}}>Universities</p>
        <p className='mt-5 ' style={{
            fontSize:'14px',
            fontFamily:'Public Sans',fontWeight:'700',color:'#0D141C' 
        }}>All</p> 
        <div className='border-t border-[#D1DBE8] mt-5' style={{width:'100%'}}></div>
                <div className='mt-5 flex items-center justify-between'>
            <div className='flex items-center'>
                <img src={BnuImage} alt="BNU_Logo" width={56} height={56} style={{borderRadius:'8px'}} />
                <div className='ml-2'>
                    <p className='font-bold text-base' style={{fontFamily:'Public Sans'}}>Beaconhouse National University (BNU)</p>
                    
                </div>
            </div>
            <Link to="/bnu-profile">
            <button className='bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-xs sm:text-sm md:text-base' 
                    style={{fontFamily:'Public Sans'}}>
                View Profile
            </button>
            </Link>
        </div>

        <div className='mt-4 flex items-center justify-between'>
            <div className='flex items-center'>
                <img src={UmtLogo} alt="UMT_Logo" width={56} height={56} style={{borderRadius:'8px'}} />
                <div className='ml-2'>
                    <p className='font-bold text-base' style={{fontFamily:'Public Sans'}}>University of Management and Technology (UMT)</p>
                    
                </div>
            </div>
            <Link to="/umt-profile">
            <button className='bg-blue-600 text-white px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-xs sm:text-sm md:text-base' 
                    style={{fontFamily:'Public Sans'}}>
                View Profile
            </button>
            </Link>
        </div>
    </div>
  )
}

export default Uni_Home