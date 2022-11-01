export interface NominatimAddress {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  place_rank: number;
  category: string;
  type: string;
  importance: number;
  addresstype: string;
  name: null;
  display_name: string;
  address: AddressNomi;
  boundingbox: string[];
}

export interface AddressNomi {
  amenity: string;
  house_number: string;
  road: string;
  neighbourhood: string;
  suburb: string;
  city: string;
  postcode: string;
  village: string;
  county: string;
  state: string;
  country: string;
  country_code: string;
  town: string;
  quarter: string;
}
