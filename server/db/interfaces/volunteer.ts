import {Types } from "mongoose";
export interface IVolunteer extends Document {
  phone: string;
  age: string;
  bio: string;
  interested_on: string[];
  country: string;
  street_address: string;
  profile_img: string;
  availability_date: {
    start_date: string;
    end_date: string;
  };
  availability_time: {
    start_time: string;
    end_time: string;
  };
  user: Types.ObjectId;
}
