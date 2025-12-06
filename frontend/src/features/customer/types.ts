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
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  logo?: string;
}

export interface DeliveryAddress {
  buildingNumber: string;
  streetName: string;
  apartmentUnit?: string;
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
