import {ID} from '@datorama/akita';

export interface Breweries {
  id: ID;
  name: string;
  breweryType: string;
  street: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  countyProvince: string;
  postalCode: string;
  country: string;
  longitude: string;
  latitude: string;
  phone: string;
  websiteUrl: string;
  updatedAt: string;
  createdAt: string;
}

/**
 * Uma função que cria a entidade
 */
export function createBreweries(params?: Partial<Breweries>) {
  return {
    id: '',
    name: '',
    breweryType: '',
    street: '',
    address2: '',
    address3: '',
    city: '',
    state: '',
    countyProvince: '',
    postalCode: '',
    country: '',
    longitude: '',
    latitude: '',
    phone: '',
    websiteUrl: '',
    updatedAt: '',
    createdAt: '',
    ...params
  } as Breweries;
}
