import React from 'react'
import bgImage from '../assets/Background/bgImage.jpg'
import Card from '../components/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faCoins} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux'

export default function Home() {
  const isLoggedIn = useSelector((state) => state.LoginSlice.isLoggedIn)
const navigate = useNavigate();

    const destinations = [
      {
        location: "Pokhara",
        numerator: 45,
        denominator: 10,
        reviews: 120,
        scene: bgImage
      },
      {
        location: "Kathmandu",
        numerator: 38,
        denominator: 8,
        reviews: 98,
        scene: bgImage
      },
      {
        location: "Chitwan",
        numerator: 50,
        denominator: 12,
        reviews: 150,
        scene: bgImage
      },
        {
        location: "Lumbini",
        numerator: 45  ,
        denominator: 12,
        reviews: 150,
        scene: bgImage
      }
    ];

    const FirstSection = () => {
        return(
                  <div className='w-full h-screen flex justify-center bg-cover bg-center'>
        <div
          className='w-9/10 h-10/12 overflow-hidden shadow-lg flex items-center justify-center text-white relative rounded-2xl mt-5'
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}>
          <div className="absolute inset-0 bg-black/30 z-0"></div>
          <div>
            <p className='text-4xl relative z-10 text-center'>Discover Nepal's Hidden Gems</p>
            <p className='text-[18px] relative  z-10 text-center'>Experience the beauty, culture, and adventure that awaits you</p>
          </div>
        </div>
      </div>
        )
    }

    const PopularDestinations = () => {
      const handleViewMore = () => {
        if (isLoggedIn) {
          navigate('/search');
        } else {
          alert('You have to login/signup first');
        }
      };

        return (
            <div className="w-full flex flex-col items-center p-10">
            <h2 className="text-3xl font-bold text-darkBlue mb-2 text-center">Popular Destinations</h2>
            <p className="text-lg text-gray-600 mb-8 text-center max-w-xl">
               These are some of the most popular destinations in Nepal, each offering unique experiences and breathtaking views.
            </p>
            <div className="w-full flex flex-wrap justify-center gap-6">
                {destinations.map((dest, idx) => (
                    <div key={idx} className="w-full sm:w-[300px] flex justify-center">
                        <Card {...dest} />
                    </div>
                ))}
            </div>
            <button className='button bg-mainRed m-10' onClick={handleViewMore}>
          View more
        </button>
        </div>
        )
    }

    const WhyChooseBhraman = () => {
        return (
            <div className="w-full flex flex-col items-center p-10 bg-gray-50">
                <h2 className="text-3xl font-bold text-darkBlue mb-4 text-center">Why Choose Bhraman?</h2>
                <p className="text-lg text-gray-700 mb-10 text-center max-w-2xl">
                    At Bhraman, we are committed to making your travel experience memorable, safe, and affordable. Discover why thousands trust us for their adventures across Nepal.
                </p>
                <div className="flex flex-col md:flex-row gap-8 w-full max-w-3xl justify-center">
                    <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                        <div  className='rounded-full bg-[#F5A113] flex  justify-center items-center p-3 mb-2'>
                        <FontAwesomeIcon icon={faShieldHalved} className='text-3xl text-white'/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-[#F5A113]">Safe & Secure</h3>
                        <p className="text-gray-600 text-center">
                            Your safety is our top priority. We ensure secure bookings, verified partners, and 24/7 customer support for a worry-free journey.
                        </p>
                    </div>
                    <div className="flex-1 bg-white rounded-xl shadow-md p-8 flex flex-col items-center">
                                            <div  className='rounded-full bg-mainGreen flex  justify-center items-center p-3 mb-2'>
                        <FontAwesomeIcon icon={faCoins} className='text-3xl text-white'/>
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-mainGreen">Best Value</h3>
                        <p className="text-gray-600 text-center">
                            Get the best deals and unmatched value for your trips. We offer transparent pricing and exclusive offers to make your travel affordable.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

  return (
    <div>
        <FirstSection/>
        <PopularDestinations/>
        <WhyChooseBhraman/>
    </div>
  )
}
