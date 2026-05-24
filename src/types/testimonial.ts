// Testimonial Types

export interface Testimonial {
  id: string;
  customerName: string;
  rating: number; // 1-5
  reviewText: string;
  date: Date;
  vehicleName?: string;
}
