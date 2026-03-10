import React from 'react';
import { Link } from 'react-router-dom';

const Services = ({ user, setUser }) => {
  const categories = [
    {
      title: "Featured Tasks",
      subtitle: "Let BesHandyman help tackle your to-do list.",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/uvhli36lpkyxpgrkwblj",
      links: [
        "Furniture Assembly", "Home Repairs", "Snow Removal", "Heavy Lifting", "Home Cleaning", "TV Mounting", "Plumbing", "Hang Art, Mirror & Decor", "Electrical Help", "Wait in Line", "Closet Organization Service"
      ]
    },
    {
      title: "Handyman",
      subtitle: "Hire a BesHandyman for help around the house.",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/iakiz9oyfy0rt5tcw74k",
      links: [
        "Door, Cabinet, & Furniture Repair", "Appliance Installation & Repairs", "Furniture Assembly", "TV Mounting", "Drywall Repair Service", "Flooring & Tiling Help", "Electrical Help", "Sealing & Caulking", "Plumbing", "Window & Blinds Repair", "Ceiling Fan Installation", "Smart Home Installation", "Heavy Lifting", "Install Air Conditioner", "Painting", "Install Shelves, Rods & Hooks", "Home Maintenance", "Install Blinds & Window Treatments", "Home Repairs", "Baby Proofing", "Yard Work Services", "Light Installation", "Carpentry Services", "Hang Art, Mirror & Decor", "General Mounting", "Cabinet Installation", "Wallpapering Service", "Fence Installation & Repair Services", "Deck Restoration Services", "Doorbell Installation", "Home Theater Installing"
      ]
    },
    {
      title: "Moving Services",
      subtitle: "From heavy lifting to unpacking, make your move with BesHandyman!",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/qsneajnue7udlov0smkb",
      links: [
        "Help Moving", "Truck Assisted Help Moving", "Packing Services & Help", "Unpacking Services", "Heavy Lifting", "Local Movers", "Junk Pickup", "Furniture Movers", "One Item Movers", "Storage Unit Moving", "Couch Removal", "Mattress Pick-Up & Removal", "Furniture Removal", "Pool Table Movers", "Appliance Removal", "Heavy Furniture Moving", "Rearranging Furniture", "Full Service Help Moving", "In-Home Furniture Movers"
      ]
    },
    {
      title: "Furniture Assembly",
      subtitle: "Furniture Assembly",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/qlnbm9iobu3jukhqw5q1",
      links: [
        "Furniture Assembly", "Patio Furniture Assembly", "Desk Assembly", "Dresser Assembly", "Bed Assembly", "Bookshelf Assembly", "Couch Assembly", "Chair Assembly", "Wardrobe Assembly", "Table Assembly", "Disassemble furniture"
      ]
    },
    {
      title: "Mounting & Installation",
      subtitle: "Wall Mounting",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/cm4icsesada13e5qwvwe",
      links: [
        "TV Mounting", "Install Shelves, Rods & Hooks", "Ceiling Fan Installation", "Install Blinds & Window Treatments", "Hang Art, Mirror & Decor", "General Mounting", "Hang Christmas Lights"
      ]
    },
    {
      title: "Cleaning",
      subtitle: "BesHandyman will make your home sparkle!",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/v4derwxej8iigyyri4ua",
      links: [
        "House Cleaning Services", "Deep Cleaning", "Disinfecting Services", "Move In Cleaning", "Move Out Cleaning", "Vacation Rental Cleaning", "Carpet Cleaning Service", "Garage Cleaning", "One Time Cleaning Services", "Car Washing", "Laundry Help", "Pressure Washing", "Spring Cleaning"
      ]
    },
    {
      title: "Shopping + Delivery",
      subtitle: "Get anything from groceries to furniture",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/jymnwqzhwmi9gt5ppz8d",
      links: [
        "Delivery Service", "Grocery Shopping & Delivery", "Running Your Errands", "Christmas Tree Delivery", "Wait in Line", "Deliver Big Piece of Furniture", "Drop Off Donations", "Contactless Delivery", "Pet Food Delivery", "Baby Food Delivery", "Return Items", "Wait for Delivery", "Shipping", "Breakfast Delivery", "Coffee Delivery"
      ]
    },
    {
      title: "Yardwork Services",
      subtitle: "Hire a BesHandyman to help with yardwork & landscaping!",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/vg0ayodhdpmqj07ypkoa",
      links: [
        "Gardening Services", "Weed Removal", "Lawn Care Services", "Lawn Mowing Services", "Landscaping Services", "Gutter Cleaning", "Tree Trimming Service", "Vacation Plant Watering", "Patio Cleaning", "Hot Tub Cleaning", "Fence Installation & Repair Services", "Deck Restoration Services", "Patio Furniture Assembly", "Fence Staining", "Mulching Services", "Lawn Fertilizer Service", "Hedge Trimming Service", "Outdoor Party Setup", "Urban Gardening Service", "Leaf Raking & Removal", "Produce Gardening", "Hose Installation", "Shed Maintenance", "Pressure Washing"
      ]
    },
    {
      title: "Holidays",
      subtitle: "Holiday Help",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/blxahxpngxgsm9tzdm4v",
      links: [
        "Gift Wrapping Services", "Hang Christmas Lights", "Christmas Tree Delivery", "Holiday Decorating", "Party Cleaning", "Toy Assembly Service", "Wait in Line", "Christmas Tree Removal"
      ]
    },
    {
      title: "Winter Tasks",
      subtitle: "Get help with winter tasks",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/b8zxzgkmmy0hxjrca1sr",
      links: [
        "Snow Removal", "Sidewalk Salting", "Window Winterization", "Residential Snow Removal", "Christmas Tree Removal", "AC Winterization", "Winter Yardwork", "Pipe Insulation", "Storm Door Installation", "Winter Deck Maintenance", "Water Heater Maintenance", "Wait in Line"
      ]
    },
    {
      title: "Personal Assistant",
      subtitle: "Hire a BesHandyman to be your personal assistant!",
      image: "https://res.cloudinary.com/taskrabbit-com/image/upload/c_limit,f_auto,q_auto,w_800/nqbgzuk5vyyok4fud9ek",
      links: [
        "Personal Assistant", "Running Your Errands", "Wait in Line", "Organization", "Organize Home", "Closet Organization Service", "Interior Design Service", "Virtual Assistant"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto w-full border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <img 
            src="/beshandyman.jpg" 
            alt="Bes Handyman Logo" 
            className="h-12 w-auto object-contain rounded-md" 
          />
          <div className="text-2xl font-extrabold tracking-tight text-[#D4AF37]">
            Bes<span className="text-white">Handyman</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
            {!user ? (
                <>
                <Link to="/login" className="text-zinc-300 hover:text-[#D4AF37] font-bold">Sign In</Link>
                <Link to="/register" className="px-4 py-2 bg-[#D4AF37] text-zinc-950 font-bold rounded hover:bg-[#C5A028]">Register</Link>
                </>
            ) : (
                <div className="flex items-center gap-4">
                  <Link to="/profile" className="px-4 py-2 bg-[#D4AF37] text-zinc-950 font-bold rounded hover:bg-[#C5A028]">Profile</Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('userInfo');
                      setUser(null);
                    }}
                    className="px-4 py-2 text-sm font-bold text-white border border-zinc-700 rounded hover:bg-zinc-800 transition-colors"
                  >
                    Logout
                  </button>
                </div>
            )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-12 w-full">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-white">
          Hire a trusted BesHandyman.
        </h2>
        
        <div className="flex flex-col gap-12">
          {categories.map((cat, index) => (
            <div key={index} className="flex flex-col md:flex-row bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
              {/* Image Section */}
              <div className="w-full md:w-1/3 relative h-64 md:h-auto">
                <img 
                  src={cat.image} 
                  alt={cat.title} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              
              {/* Content Section */}
              <div className="p-8 w-full md:w-2/3 flex flex-col justify-center text-left">
                <Link to={`/services/${cat.title.toLowerCase().replace(/ /g, '-')}`} className="inline-block">
                  <h3 className="text-2xl font-bold text-[#D4AF37] mb-2 hover:underline">{cat.title}</h3>
                </Link>
                <p className="text-zinc-400 mb-6">{cat.subtitle}</p>
                <hr className="border-zinc-800 mb-6" />
                
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                  {cat.links.map((link, i) => (
                    <li key={i}>
                      <Link 
                        to={`/services/${link.toLowerCase().replace(/ /g, '-')}`} 
                        className="text-sm text-zinc-300 hover:text-[#D4AF37] transition-colors flex items-center gap-2"
                      >
                        <span className="text-[#D4AF37]">•</span> {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
