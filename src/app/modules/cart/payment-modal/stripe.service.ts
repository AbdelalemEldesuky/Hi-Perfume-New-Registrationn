import { Injectable } from '@angular/core';
import { STRIPE_PUBLISHABLE_KEY } from './constants';
import { Stripe } from 'stripe';

@Injectable({
  providedIn: 'root'
})
export class StripeService {

  constructor(
  private stripe: Stripe
  ) {
    this.stripe = new Stripe(STRIPE_PUBLISHABLE_KEY, {
        apiVersion: null
      });
  }

  createToken(cardNumber: string, expMonth: string, expYear: string, cvc: string) {
    const card = {
      number: cardNumber,
      exp_month: expMonth,
      exp_year: expYear,
      cvc: cvc
    };
    return (window as any).Stripe.card.createToken(card);
  }


createCharge(tokenId: string, amount: number) {
  const url = 'https://api.stripe.com/v1/charges';
  const headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded',
    'Authorization': `Bearer ${STRIPE_PUBLISHABLE_KEY}`
  });
  const body = new URLSearchParams({
    'amount': amount.toString(),
    'currency': 'usd',
    'source': tokenId
  });
  const options: RequestInit = {
    method: 'POST',
    headers: headers,
    body: body,
  };
  return fetch(url, options).then(response => response.json());
}
}
