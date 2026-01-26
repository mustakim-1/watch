const watchData = [
  {
    id: "w1",
    title: "Naruto Storm Watch",
    desc: "Flame dial design with vibrant red strap. Perfect for Naruto fans.",
    price: "৳1,499",
    img: "images/naruto_storm.png",
    specs: {
      movement: "Automatic NH35",
      case: "42mm Steel",
      water: "100m",
      strap: "Nylon NATO",
      warranty: "1 Year"
    },
    images: [
      "images/naruto_storm.png",
      "images/naruto_storm_side.png",
      "images/naruto_storm_back.png",
      "images/naruto_storm_wrist.png"
    ]
  },
  {
    id: "w2",
    title: "Saiyan Force Edition",
    desc: "Electric blue energy dial with black strap. Feel the power of the Saiyans.",
    price: "৳1,599",
    img: "images/saiyan_force.png",
    specs: {
      movement: "Automatic NH35",
      case: "40mm Steel",
      water: "50m",
      strap: "Leather",
      warranty: "1 Year"
    },
    images: [
      "images/saiyan_force.png",
      "images/saiyan_force_side.png",
      "images/saiyan_force_back.png",
      "images/saiyan_force_wrist.png"
    ]
  },
  {
    id: "w3",
    title: "Lunar Serenity",
    desc: "Elegant moon phases dial with soft pastel strap. For magical moments.",
    price: "৳1,699",
    img: "images/lunar_serenity.png",
    specs: {
      movement: "Quartz",
      case: "38mm Rose Gold",
      water: "30m",
      strap: "Silk-feel Leather",
      warranty: "2 Years"
    },
    images: [
      "images/lunar_serenity.png",
      "images/lunar_serenity_detail.png",
      "images/lunar_serenity_box.png",
      "images/lunar_serenity_lifestyle.png"
    ]
  },
  {
    id: "w4",
    title: "Dragon Ball Z Power",
    desc: "Golden aura accents with a rugged case design inspired by DBZ.",
    price: "৳1,699",
    img: "images/dragon-ball-zee-chromebook-wallpaper.jpg",
    specs: {
      movement: "Automatic",
      case: "44mm Tactical",
      water: "200m",
      strap: "Resin",
      warranty: "1 Year"
    }
  },
  {
    id: "w5",
    title: "Titan x DBZ Edition",
    desc: "Collaboration piece featuring intricate engraving and premium materials.",
    price: "৳2,499",
    img: "images/unnamed.png",
    specs: {
      movement: "Swiss Automatic",
      case: "42mm Titanium",
      water: "100m",
      strap: "Metal Link",
      warranty: "3 Years"
    }
  },
  {
    id: "w6",
    title: "Midnight Chrono",
    desc: "Tactical stealth design with night-vision inspired details.",
    price: "৳2,199",
    img: "images/0745011JAA_flat_1-removebg-preview.png",
    specs: {
      movement: "Quartz Chronograph",
      case: "45mm Matte Black",
      water: "100m",
      strap: "Rubber Tactical",
      warranty: "2 Years"
    }
  },
  {
    id: "w7",
    title: "Crimson Automatic",
    desc: "A bold statement piece with exposed automatic movement and deep red accents.",
    price: "৳3,299",
    img: "images/c85264a70bc46321aef23f2b08d2831f.jpg_720x720q80-removebg-preview.png",
    specs: {
      movement: "Automatic Skeleton",
      case: "43mm Polished Steel",
      water: "50m",
      strap: "Red Leather",
      warranty: "2 Years"
    }
  }
];

// Initialize reviews data structure
const initializeReviews = () => {
  if (!localStorage.getItem('dialcraft_reviews')) {
    const initialReviews = {};
    watchData.forEach(watch => {
      initialReviews[watch.id] = [];
    });
    localStorage.setItem('dialcraft_reviews', JSON.stringify(initialReviews));
  }
};

if (typeof window !== 'undefined') {
  // Only initialize if data doesn't exist to preserve Admin changes
  if (!localStorage.getItem('dialcraft_products')) {
    localStorage.setItem('dialcraft_products', JSON.stringify(watchData));
  }
  initializeReviews();
}

if (typeof module !== 'undefined') {
  module.exports = watchData;
}
