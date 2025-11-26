import client from "./sanity";

// Function to get banners
export const getBanners = async (lan = "ar") => {
  try {
    const query = `*[_type == "banner"] {
      _id, 
      poster, 
      offer->{
        _id,
        slug,
        startPrice
      }, 
      "title": title[$language],
      "description": description[$language]
    }`;

    const params = { language: lan };
    const resultBanner = await client.fetch(query, params);

    return resultBanner.map((banner) => ({
      id: banner._id,
      poster: banner.poster || "",
      title: banner.title,
      description: banner.description,
      offer: banner.offer,
    }));
  } catch (error) {
    console.error("Error in getBanners:", error.message, error);
    return { error: error.message };
  }
};

// Function to get offers
export const getOffers = async (lan = "ar") => {
  try {
    const query = `*[_type == "offers"] {
      poster,
      _id,
      "titleHeader": titleHeader[$language],
      "overview": overview[$language],
      duration,
      startPrice,
      numberOfGuests,
      numberOfPassengers,
      slug,
      most,
      "map": map[$language]
    }`;

    const params = { language: lan };
    const resultOffer = await client.fetch(query, params);

    return resultOffer.map((offer) => ({
      id: offer._id,
      title: offer.titleHeader,
      poster: offer.poster || "",
      overview: offer.overview,
      duration: offer.duration,
      price: offer.startPrice,
      slug: offer.slug,
      most: offer.most,
      map: offer.map,
      numberOfGuests: offer.numberOfGuests,
      typeJourney: offer.numberOfPassengers,
    }));
  } catch (error) {
    console.error("Error in getOffers:", error.message, error);
    return { error: error.message };
  }
};

// Function to get destinations
export const getDestinations = async (lan = "ar") => {
  try {
    const query = `*[_type == "places"] {
      "title": title[$language],
      imageBanner {
        asset->{
          url
        }
      },
      slug,
      _id
    }`;

    const params = { language: lan };
    const resultPlaces = await client.fetch(query, params);

    return resultPlaces.map((place) => ({
      id: place._id,
      title: place.title,
      image: place.imageBanner || "",
      slug: place.slug,
    }));
  } catch (error) {
    console.error("Error in getDestinations:", error.message, error);
    return { error: error.message };
  }
};

export const getAllOffers = async (lan = "ar") => {
  try {
    const queries = {
      banner: `*[_type == "banner"] {
        _id, 
        poster, 
        offer->{
          _id,
          slug,
          startPrice
        }, 
        "title": title[$language],
        "description": description[$language]
      }`,
      offers: `*[_type == "offers"] {
        poster,
        _id,
        "titleHeader": titleHeader[$language],
        "overview": overview[$language],
        duration,
        startPrice,
        numberOfGuests,
        numberOfPassengers,
        slug,
        most,
        "map": map[$language]
      }`,
      places: `*[_type == "places"] {
        "title": title[$language],
        image__banner {
          asset->{
            url
          }
        },
        slug,
        _id
      }`,
    };

    // Helper function to fetch data with language parameter
    const fetchData = async (query, params) => {
      return await client.fetch(query, params);
    };

    // Execute all queries in parallel with language parameter
    const params = { language: lan };
    const [resultBanner, resultOffer, resultPlaces] = await Promise.all([
      fetchData(queries.banner, params),
      fetchData(queries.offers, params),
      fetchData(queries.places, params),
    ]);

    // Transform data into a cleaner structure if necessary
    return {
      banners: resultBanner.map((banner) => ({
        id: banner._id,
        poster: banner.poster || "",
        title: banner.title,
        description: banner.description,
        offer: banner.offer,
      })),
      offers: resultOffer.map((offer) => ({
        id: offer._id,
        title: offer.titleHeader,
        poster: offer.poster || "",
        overview: offer.overview,
        duration: offer.duration,
        price: offer.startPrice,
        slug: offer.slug,
        most: offer.most,
        map: offer.map,
        numberOfGuests: offer.numberOfGuests,
        typeJourney: offer.numberOfPassengers,
      })),
      places: resultPlaces.map((place) => ({
        id: place._id,
        title: place.title,
        image: place.image__banner || "",
        slug: place.slug,
      })),
    };
  } catch (error) {
    console.error("Error in getAllOffers:", error.message, error);
    return { error: error.message };
  }
};

export const getHomeData = async (language) => {
  try {
    const queries = {
      offers: `*[_type == "offers"] {
        poster,
        _id,
        "titleHeader": titleHeader[$language],
        "overview": overview[$language],
        duration,
        startPrice,
        slug,
        most,
        "map": map[$language]
      }`,
      places: `*[_type == "places"] {
        "title": title[$language],
        image__banner,
        slug,
        poster,
        _id
      }`,
    };

    // Helper function to fetch data
    const fetchData = async (query, params) => {
      return await client.fetch(query, params);
    };

    // Execute all queries in parallel
    const [offers, places] = await Promise.all([
      fetchData(queries.offers, { language }),
      fetchData(queries.places, { language }),
    ]);

    // Organize data for the homepage
    const offersData = offers.map((offer) => ({
      id: offer._id,
      title: offer.titleHeader,
      poster: offer.poster || "",
      overview: offer.overview,
      duration: offer.duration,
      price: offer.startPrice,
      slug: offer.slug,
      map: offer.map,
      most: offer.most,
    }));
    const placesData = places.map((place) => ({
      id: place._id,
      title: place.title || "",
      image: place.image__banner || "",
      slug: place.slug,
      poster: place.poster,
    }));

    return [offersData, placesData];
  } catch (error) {
    console.error("Error fetching home data:", error);
    return { error: error.message };
  }
};

export const getPlacesData = async (language = "en") => {
  try {
    const queryPlaces = `
      *[_type == "places"][0...5] {  // Fetch only the first 5 places
        "title": title[$language],
      
       
        slug,
        _id
      }
    `;

    // Fetch the places data
    const params = { language };
    const places = await client.fetch(queryPlaces, params);

    // Transform data into a clean structure
    return places.map((place) => ({
      id: place._id,
      title: place.title,

      slug: place.slug,
    }));
  } catch (error) {
    console.error("Error fetching places data:", error.message, error);
    return { error: error.message };
  }
};

export const getOffersLength = async (id) => {
  const offerParms = { _ref: id };
  const numberOffer = `*[_type == "offers" && place._ref == $_ref] {_id}`;
  const numberOfferq = await client.fetch(numberOffer, offerParms);
  const offerLength = numberOfferq?.length;
  return { offerLength };
};

export const getOfferById = async (offerId, lan = "ar") => {
  try {
    const query = `*[_type == "offers" && slug.current == $offerId] {
      inclusions[] ,
      titleHeader {
        ${lan}
      },
      duration,
      map {
        ${lan}
      },
      overview {
        ${lan}
      },
      typejourney {
        ${lan}
      },
      price[] {
        ${lan}
      },
      startPrice,
      singel,
      _createdAt,
      _id,
      _rev,
      _type,
      _updatedAt,
      images,
      passengerType,
  itinerary[]{
    _key,
    _type,
    title {
      ${lan} // Retrieve the itinerary title in the specified language
    },
    description {
      ${lan} // Retrieve the itinerary description in the specified language
    },
    images[] {
      "url": asset->url // Retrieve the URL of each image in the itinerary
    }
  }
      
     
    }`;
    const params = { offerId, lan };
    const result = await client.fetch(query, params);
    return result[0];
  } catch (error) {
    return error.message;
  }
};
export const getDestinationById = async (placeId, lan = "ar") => {
  try {
    if (!placeId) {
      throw new Error("Place ID is required.");
    }

    // Query for fetching the destination details
    const queryDestination = `
      *[_type == "places" && slug.current == $placeId] {
        "title": title[$language],
        imageBanner {
          asset->{
            url
          },
          "title": title[$language]
        },
        _id
      }
    `;
    const paramsDestination = { placeId, language: lan };

    const resultDestination = await client.fetch(
      queryDestination,
      paramsDestination
    );

    if (!resultDestination || resultDestination.length === 0) {
      throw new Error("Destination not found.");
    }

    const destination = resultDestination[0];

    // Query for fetching offers related to the destination
    const queryOffer = `
      *[_type == "offers" && place._ref == $destinationId] {
        poster {
          asset->{
            url
          }
        },
        _id,
        "titleHeader": titleHeader[$language],
        "overview": overview[$language],
        slug,
        duration,
        startPrice,
        "map": map[$language]
      }
    `;
    const paramsOffer = { destinationId: destination._id, language: lan };

    const resultOffer = await client.fetch(queryOffer, paramsOffer);

    const offersData = resultOffer.map((offer) => ({
      id: offer._id,
      title: offer.titleHeader,
      poster: offer.poster || "",
      overview: offer.overview,
      duration: offer.duration,
      price: offer.startPrice,
      slug: offer.slug,
      map: offer.map,
      most: offer.most,
    }));
    return {
      destination,
      offers: offersData || [],
    };
  } catch (error) {
    console.error("Error in getDestinationById:", error.message);
    return { error: error.message };
  }
};

export const getAboutData = async (lan) => {
  const language = lan || "en"; // Default to English if no language is provided
  try {
    // Query to filter by language using i18n fields
    const queryOffice = `
      *[_type == "office"] {
        "title": title[$language],
        "address": address[$language],
        map,
        phone,
        email,
        "duration": duration[$language],
        imgUrl,
        _id,
        whatsapp
      }
    `;
    const params = { language };

    const office = await client.fetch(queryOffice, params);

    // Replace 'whoUs' and 'whyUs' with your actual queries or remove them if unnecessary
    return { office };
  } catch (error) {
    return { error: error.message };
  }
};

// export const getAboutData = async (lan) => {
//   let language = lan;
//   const params = { language };
//   try {
//     const queryOffice = '*[_type == "office"]';
//     const queryWhyUs = '*[_type == "why_us" && language == $language]';
//     const queryWhoUs = '*[_type == "who_us" && language == $language]';
//     const office = await client.fetch(queryOffice, params);
//     const whyUs = await client.fetch(queryWhyUs, params);
//     const whoUs = await client.fetch(queryWhoUs, params);
//     return { office, whoUs, whyUs };
//   } catch (error) {
//     return error.message;
//   }
// };

export const getScoial = async () => {
  try {
    const query = `*[_type == "scoial"]`;
    const scoial = await client.fetch(query);
    return { scoial };
  } catch (error) {
    return { error: error.message };
  }
};
