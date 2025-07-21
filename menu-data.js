const menuItems = {
    party_set_b: {
      name: "PARTY SET B (74 PCS)",
      image: "/WebApp/assets/images/foods/party_set/party_set_b.png",
      price: "RM 99.90",
      rating: 4.8,
      reviews: [
        { name: "Aina Rahman", text: "Banyak pilihan, sesuai untuk keluarga!" },
        { name: "Jason Lim", text: "Fresh and delicious, will order again." }
      ],
      included: [
        "Nigiri (30 pcs): Inari x 4, Tamago x 4, Ika x 4, Ebi x 4, White Tuna x 4, Unagi x 5, Kani x 5",
        "Gunkan (14 pcs): Ebiko x 7, Salmon Mayo x 7",
        "Maki (30 pcs): Kappa x 10, Sake x 10, Tamago x 10"
      ]
    },
    maki_set: {
      name: "MAKI SET (30 PCS)",
      image: "/WebApp/assets/images/foods/party_set/maki_set.png",
      price: "RM 49.90",
      rating: 4.6,
      reviews: [
        { name: "Siti Noor", text: "Maki rolls are fresh and tasty!" },
        { name: "Lim Wei", text: "Good value for money." }
      ],
      included: ["Assorted maki rolls (30 pcs)"]
    },
    party_set_a: {
      name: "PARTY SET A (81 PCS)",
      image: "/WebApp/assets/images/foods/party_set/party_set_a.png",
      price: "RM 109.90",
      rating: 4.9,
      reviews: [
        { name: "Ayu", text: "Perfect for big gatherings!" },
        { name: "Kumar", text: "Everyone loved it." }
      ],
      included: ["Assorted sushi and maki (81 pcs)"]
    },
    gunkan_set: {
      name: "GUNKAN SET (20 PCS)",
      image: "/WebApp/assets/images/foods/party_set/gunkan_set.png",
      price: "RM 45.90",
      rating: 4.5,
      reviews: [
        { name: "Nadia", text: "Gunkan was delicious!" },
        { name: "Alex", text: "Nice variety." }
      ],
      included: ["Assorted gunkan (20 pcs)"]
    },
    party_set_c: {
      name: "PARTY SET C (65 PCS)",
      image: "/WebApp/assets/images/foods/party_set/party_set_c.png",
      price: "RM 89.90",
      rating: 4.7,
      reviews: [
        { name: "Farah", text: "Great for sharing." },
        { name: "John", text: "Good selection." }
      ],
      included: ["Assorted sushi and maki (65 pcs)"]
    },
    nigiri_set: {
      name: "NIGIRI SET (25 PCS)",
      image: "/WebApp/assets/images/foods/party_set/nigiri_set.png",
      price: "RM 59.90",
      rating: 4.6,
      reviews: [
        { name: "Ming", text: "Nigiri was fresh!" },
        { name: "Sara", text: "Loved the variety." }
      ],
      included: ["Assorted nigiri (25 pcs)"]
    },
    chuka_hotate: {
      name: "CHUKA HOTATE",
      image: "/WebApp/assets/images/foods/appetizers/chuka_hotate.png",
      price: "RM 8.90",
      rating: 4.3,
      reviews: [
        { name: "Aiman", text: "Nice starter." },
        { name: "Lily", text: "Tasty and fresh." }
      ],
      included: ["Seasoned scallop appetizer"]
    },
    chuka_idako: {
      name: "CHUKA IDAKO",
      image: "/WebApp/assets/images/foods/appetizers/chuka_idako.png",
      price: "RM 8.90",
      rating: 4.4,
      reviews: [
        { name: "Rina", text: "Love the baby octopus!" },
        { name: "Sam", text: "Great flavor." }
      ],
      included: ["Seasoned baby octopus appetizer"]
    },
    chuka_kurage: {
      name: "CHUKA KURAGE",
      image: "/WebApp/assets/images/foods/appetizers/chuka_kurage.png",
      price: "RM 8.90",
      rating: 4.2,
      reviews: [
        { name: "Zara", text: "Unique texture." },
        { name: "Ben", text: "Nice and crunchy." }
      ],
      included: ["Seasoned jellyfish appetizer"]
    },
    chuka_wakame: {
      name: "CHUKA WAKAME",
      image: "/WebApp/assets/images/foods/appetizers/chuka_wakame.png",
      price: "RM 8.90",
      rating: 4.5,
      reviews: [
        { name: "Hana", text: "Fresh seaweed!" },
        { name: "Lee", text: "Healthy and tasty." }
      ],
      included: ["Seasoned seaweed appetizer"]
    },
    mochi: {
      name: "MOCHI",
      image: "/WebApp/assets/images/foods/appetizers/mochi.png",
      price: "RM 6.90",
      rating: 4.1,
      reviews: [
        { name: "Maya", text: "Soft and chewy." },
        { name: "Dan", text: "Nice dessert." }
      ],
      included: ["Japanese rice cake dessert"]
    },
    salmon_moriawase: {
      name: "SALMON MORIAWASE",
      image: "/WebApp/assets/images/foods/moriawase_makimono_set/salmon_moriawase.png",
      price: "RM 39.90",
      rating: 4.7,
      reviews: [
        { name: "Kenji", text: "Salmon was fresh!" },
        { name: "Amy", text: "Great set." }
      ],
      included: ["Assorted salmon maki and sushi"]
    },
    moriawase_a: {
      name: "MORIAWASE SET A",
      image: "/WebApp/assets/images/foods/moriawase_makimono_set/moriawase_a.png",
      price: "RM 49.90",
      rating: 4.6,
      reviews: [
        { name: "Tom", text: "Good variety." },
        { name: "Sue", text: "Nice presentation." }
      ],
      included: ["Assorted sushi set"]
    },
    moriawase_b: {
      name: "MORIAWASE SET B",
      image: "/WebApp/assets/images/foods/moriawase_makimono_set/moriawase_b.png",
      price: "RM 59.90",
      rating: 4.8,
      reviews: [
        { name: "Ali", text: "Loved it!" },
        { name: "Nina", text: "Very fresh." }
      ],
      included: ["Assorted sushi set"]
    },
    kani_maki: {
      name: "KANI MAKI",
      image: "/WebApp/assets/images/foods/maki_rolls/kani_maki.png",
      price: "RM 7.90",
      rating: 4.2,
      reviews: [
        { name: "Ryo", text: "Nice crab flavor." },
        { name: "Kim", text: "Good for kids." }
      ],
      included: ["Crab stick maki roll"]
    },
    kappa_maki: {
      name: "KAPPA MAKI",
      image: "/WebApp/assets/images/foods/maki_rolls/kappa_maki.png",
      price: "RM 7.90",
      rating: 4.1,
      reviews: [
        { name: "Lina", text: "Refreshing cucumber." },
        { name: "Joe", text: "Simple and nice." }
      ],
      included: ["Cucumber maki roll"]
    },
    sake_maki: {
      name: "SAKE MAKI",
      image: "/WebApp/assets/images/foods/maki_rolls/sake_maki.png",
      price: "RM 8.90",
      rating: 4.3,
      reviews: [
        { name: "Mio", text: "Salmon was good." },
        { name: "Sam", text: "Would order again." }
      ],
      included: ["Salmon maki roll"]
    },
    tamago_maki: {
      name: "TAMAGO MAKI",
      image: "/WebApp/assets/images/foods/maki_rolls/tamago_maki.png",
      price: "RM 7.90",
      rating: 4.0,
      reviews: [
        { name: "Aya", text: "Sweet egg roll." },
        { name: "Ben", text: "Kids love it." }
      ],
      included: ["Egg omelette maki roll"]
    },
    ebi_nigiri: {
      name: "EBI NIGIRI",
      image: "/WebApp/assets/images/foods/nigiri/ebi_nigiri.png",
      price: "RM 9.90",
      rating: 4.4,
      reviews: [
        { name: "Nori", text: "Shrimp was fresh." },
        { name: "Sue", text: "Nice texture." }
      ],
      included: ["Shrimp nigiri sushi"]
    },
    ika_nigiri: {
      name: "IKA NIGIRI",
      image: "/WebApp/assets/images/foods/nigiri/ika_nigiri.png",
      price: "RM 9.90",
      rating: 4.2,
      reviews: [
        { name: "Taro", text: "Squid was tender." },
        { name: "Lily", text: "Good taste." }
      ],
      included: ["Squid nigiri sushi"]
    },
    kani_mentai: {
      name: "KANI MENTAI",
      image: "/WebApp/assets/images/foods/nigiri/kani_mentai.png",
      price: "RM 10.90",
      rating: 4.3,
      reviews: [
        { name: "Mimi", text: "Mentai sauce is great." },
        { name: "Dan", text: "Rich flavor." }
      ],
      included: ["Crab stick with mentai sauce nigiri"]
    },
    sake_nigiri: {
      name: "SAKE NIGIRI",
      image: "/WebApp/assets/images/foods/nigiri/sake_nigiri.png",
      price: "RM 10.90",
      rating: 4.5,
      reviews: [
        { name: "Ken", text: "Salmon was fresh." },
        { name: "Amy", text: "Nice cut." }
      ],
      included: ["Salmon nigiri sushi"]
    },
    tako_nigiri: {
      name: "TAKO NIGIRI",
      image: "/WebApp/assets/images/foods/nigiri/tako_nigiri.png",
      price: "RM 10.90",
      rating: 4.1,
      reviews: [
        { name: "Tina", text: "Octopus was good." },
        { name: "Ray", text: "Chewy and nice." }
      ],
      included: ["Octopus nigiri sushi"]
    },
    tamago_mentai: {
      name: "TAMAGO MENTAI",
      image: "/WebApp/assets/images/foods/nigiri/tamago_mentai.png",
      price: "RM 9.90",
      rating: 4.0,
      reviews: [
        { name: "Aya", text: "Egg and mentai is a good combo." },
        { name: "Ben", text: "Sweet and savory." }
      ],
      included: ["Egg omelette with mentai sauce nigiri"]
    },
    unagi_nigiri: {
      name: "UNAGI NIGIRI",
      image: "/WebApp/assets/images/foods/nigiri/unagi_nigiri.png",
      price: "RM 12.90",
      rating: 4.6,
      reviews: [
        { name: "Ryo", text: "Unagi was delicious." },
        { name: "Kim", text: "Rich flavor." }
      ],
      included: ["Grilled eel nigiri sushi"]
    },
    ebiko: {
      name: "EBIKO",
      image: "/WebApp/assets/images/foods/gunkan/ebiko.png",
      price: "RM 8.90",
      rating: 4.2,
      reviews: [
        { name: "Nina", text: "Love the roe!" },
        { name: "Sam", text: "Crunchy and nice." }
      ],
      included: ["Fish roe gunkan sushi"]
    },
    kani_mayo: {
      name: "KANI MAYO",
      image: "/WebApp/assets/images/foods/gunkan/kani_mayo.png",
      price: "RM 8.90",
      rating: 4.1,
      reviews: [
        { name: "Lina", text: "Creamy and tasty." },
        { name: "Joe", text: "Good with mayo." }
      ],
      included: ["Crab stick with mayo gunkan sushi"]
    },
    lobster_salad_gunkan: {
      name: "LOBSTER SALAD",
      image: "/WebApp/assets/images/foods/gunkan/lobster_salad_gunkan.png",
      price: "RM 10.90",
      rating: 4.3,
      reviews: [
        { name: "Mio", text: "Lobster salad is great." },
        { name: "Sam", text: "Would order again." }
      ],
      included: ["Lobster salad gunkan sushi"]
    },
    chicken_katsu_curry_don: {
      name: "CHICKEN KATSU CURRY DON",
      image: "/WebApp/assets/images/foods/curry_sets/chicken_katsu_curry_don.png",
      price: "RM 18.90",
      rating: 4.4,
      reviews: [
        { name: "Ayu", text: "Crispy chicken!" },
        { name: "Kumar", text: "Nice curry flavor." }
      ],
      included: ["Chicken katsu with Japanese curry on rice"]
    },
    chicken_katsu_curry_udon: {
      name: "CHICKEN KATSU CURRY UDON",
      image: "/WebApp/assets/images/foods/curry_sets/chicken_katsu_curry_udon.png",
      price: "RM 18.90",
      rating: 4.3,
      reviews: [
        { name: "Nadia", text: "Udon was chewy." },
        { name: "Alex", text: "Good portion." }
      ],
      included: ["Chicken katsu with Japanese curry on udon"]
    },
    ebi_curry_don: {
      name: "EBI CURRY DON",
      image: "/WebApp/assets/images/foods/curry_sets/ebi_curry_don.png",
      price: "RM 19.90",
      rating: 4.5,
      reviews: [
        { name: "Farah", text: "Prawns were fresh." },
        { name: "John", text: "Nice curry." }
      ],
      included: ["Fried prawn with Japanese curry on rice"]
    },
    ebi_curry_udon: {
      name: "EBI CURRY UDON",
      image: "/WebApp/assets/images/foods/curry_sets/ebi_curry_udon.png",
      price: "RM 19.90",
      rating: 4.4,
      reviews: [
        { name: "Ming", text: "Udon and prawn combo is great." },
        { name: "Sara", text: "Would order again." }
      ],
      included: ["Fried prawn with Japanese curry on udon"]
    },
    chicken_teriyaki_ramen: {
      name: "CHICKEN TERIYAKI RAMEN",
      image: "/WebApp/assets/images/foods/ramen/chicken_teriyaki_ramen.png",
      price: "RM 17.90",
      rating: 4.3,
      reviews: [
        { name: "Ken", text: "Ramen was tasty." },
        { name: "Amy", text: "Chicken was juicy." }
      ],
      included: ["Chicken teriyaki with ramen noodles"]
    },
    chicken_katsu_ramen: {
      name: "CHICKEN KATSU RAMEN",
      image: "/WebApp/assets/images/foods/ramen/chicken_katsu_ramen.png",
      price: "RM 17.90",
      rating: 4.3,
      reviews: [
        { name: "Ken", text: "Ramen was tasty." },
        { name: "Amy", text: "Chicken was juicy." }
      ],
      included: ["Chicken katsu with ramen noodles"]
    },
    smoke_duck_ramen: {
      name: "SMOKE DUCK RAMEN",
      image: "/WebApp/assets/images/foods/ramen/smoke_duck_ramen.png",
      price: "RM 17.90",
      rating: 4.3,
      reviews: [
        { name: "Ken", text: "Ramen was tasty." },
        { name: "Amy", text: "Chicken was juicy." }
      ],
      included: ["Smoke duck with ramen noodles"]
    },
    dori_fish_ramen: {
      name: "DORI FISH RAMEN",
      image: "/WebApp/assets/images/foods/ramen/dori_fish_ramen.png",
      price: "RM 17.90",
      rating: 4.3,
      reviews: [
        { name: "Ken", text: "Ramen was tasty." },
        { name: "Amy", text: "Chicken was juicy." }
      ],
      included: ["Dori fish with ramen noodles"]
    },
    _100plus: {
      name: "100 PLUS",
      image: "/WebApp/assets/images/foods/drinks/100plus.png",
      price: "RM 3.90",
      rating: 4.0,
      reviews: [
        { name: "Tom", text: "Refreshing!" },
        { name: "Sue", text: "Good with sushi." }
      ],
      included: ["Isotonic drink"]
    },
    coke: {
      name: "COKE",
      image: "/WebApp/assets/images/foods/drinks/coke.png",
      price: "RM 3.90",
      rating: 4.1,
      reviews: [
        { name: "Ali", text: "Classic taste." },
        { name: "Nina", text: "Always good." }
      ],
      included: ["Coca-Cola"]
    },
    oyoshi_green_tea: {
      name: "OYOSHI GREEN TEA",
      image: "/WebApp/assets/images/foods/drinks/oyoshi_green_tea.png",
      price: "RM 4.90",
      rating: 4.2,
      reviews: [
        { name: "Kenji", text: "Nice green tea." },
        { name: "Amy", text: "Not too sweet." }
      ],
      included: ["Green tea drink"]
    },
    sprite: {
      name: "SPRITE",
      image: "/WebApp/assets/images/foods/drinks/sprite.png",
      price: "RM 3.90",
      rating: 4.0,
      reviews: [
        { name: "Tom", text: "Lemon-lime flavor." },
        { name: "Sue", text: "Good with sushi." }
      ],
      included: ["Lemon-lime soda"]
    },
    ginger: {
      name: "GINGER",
      image: "/WebApp/assets/images/foods/condiments/ginger.png",
      price: "RM 1.90",
      rating: 4.1,
      reviews: [
        { name: "Ali", text: "Good palate cleanser." },
        { name: "Nina", text: "Fresh and tangy." }
      ],
      included: ["Pickled ginger"]
    },
    soy_sauce: {
      name: "SOY SAUCE",
      image: "/WebApp/assets/images/foods/condiments/soy_sauce.png",
      price: "RM 1.90",
      rating: 4.2,
      reviews: [
        { name: "Kenji", text: "Classic condiment." },
        { name: "Amy", text: "Must have for sushi." }
      ],
      included: ["Soy sauce packet"]
    },
    wasabi: {
      name: "WASABI",
      image: "/WebApp/assets/images/foods/condiments/wasabi.png",
      price: "RM 1.90",
      rating: 4.0,
      reviews: [
        { name: "Tom", text: "Spicy kick!" },
        { name: "Sue", text: "Good with sushi." }
      ],
      included: ["Wasabi paste"]
    }
  };

// Make available globally for non-module scripts
window.menuItems = menuItems;

export { menuItems };  