export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  logo?: string;
  address?: string;
  phoneNumber?: string;
  fullAddress?: {
    bldg: string;
    streetAddress: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export interface DeliveryAddress {
  buildingNumber: string;
  streetName: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface PaymentInfo {
  cardType: string;
  cardNumber: string;
  cardholderName: string;
  billingAddress: string;
  expiryMonth: string;
  expiryYear: string;
  securityCode: string;
}
