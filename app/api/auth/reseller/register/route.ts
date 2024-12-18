import { NextRequest } from 'next/server';
import { initializePayment } from '@/lib/payment';
import { User } from '@/lib/models/user.model';
import { Store } from '@/lib/models/store.model';
import { validateUniqueShopName } from '@/lib/utils/shop';
import { generateUniqueSubdomain } from '@/lib/utils/domain';
import dbConnect from '@/lib/db/mongodb';
import bcrypt from 'bcryptjs';

const REGISTRATION_FEE = 1000; // BDT

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const data = await req.json();

    // Validate required fields
    if (!data.email || !data.password || !data.name || !data.businessName) {
      return Response.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return Response.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Validate shop name uniqueness
    try {
      const isUnique = await validateUniqueShopName(data.businessName);
      if (!isUnique) {
        return Response.json(
          { error: 'Shop name is already taken' },
          { status: 400 }
        );
      }
    } catch (error) {
      return Response.json(
        { error: error instanceof Error ? error.message : 'Invalid shop name' },
        { status: 400 }
      );
    }

    // Generate subdomain if using subdomain option
    let subdomain;
    if (data.domainType === 'subdomain') {
      subdomain = await generateUniqueSubdomain(data.subdomainPrefix || data.businessName);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Initialize registration payment
    const paymentResult = await initializePayment({
      type: 'reseller_registration',
      amount: REGISTRATION_FEE,
      registrationData: {
        // Personal Info
        email: data.email,
        password: hashedPassword,
        name: data.name,
        phoneNumber: data.phoneNumber,
        
        // Business Info
        businessName: data.businessName,
        businessDescription: data.businessDescription,
        businessAddress: data.businessAddress,
        
        // Store Settings
        storeName: data.storeName || data.businessName,
        storeDescription: data.storeDescription,
        domainSettings: {
          type: data.domainType,
          subdomain: subdomain,
          customDomain: data.customDomain,
        },
        settings: data.settings
      },
      description: 'Reseller Registration Fee'
    });

    return Response.json({
      message: 'Registration initiated',
      paymentId: paymentResult.paymentId,
      bkashURL: paymentResult.bkashURL
    });
  } catch (error) {
    console.error('Reseller registration error:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to initiate registration' },
      { status: 500 }
    );
  }
}