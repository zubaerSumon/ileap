import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { UserModel, userSchema } from '@/lib/models/schema';
import connectDB from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body against schema
    const validatedData = userSchema.parse(body);
    
    // Connect to database
    await connectDB();
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: validatedData.email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 10);
    
    // Create new user
    const user = await UserModel.create({
      ...validatedData,
      password: hashedPassword,
      createdAt: new Date(),
    });
    

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { password, ...userWithoutPassword } = user.toObject();
    
    return NextResponse.json(
      { message: 'User created successfully', user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error: Error | unknown) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Something went wrong' },
      { status: 500 }
    );
  }
}