import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { Store } from '@/lib/models/store.model';
import { generateUniqueSubdomain, validateDomain } from '@/lib/utils/domain';
import dbConnect from '@/lib/db/mongodb';
import { apiConfig } from '../../route-config';
export const { dynamic, fetchCache, revalidate } = apiConfig;

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'reseller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if store already exists
    const existingStore = await Store.findOne({ reseller: session.user.id });
    if (existingStore) {
      return Response.json(
        { error: 'Store already exists' },
        { status: 400 }
      );
    }

    const { name, description, domain, isDomainCustom, settings } = await req.json();
    if (!name || !domain) {
      return Response.json(
        { error: 'Store name and domain are required' },
        { status: 400 }
      );
    }

    // Generate subdomain or validate custom domain
    let subdomain;
    if (!isDomainCustom) {
      subdomain = await generateUniqueSubdomain(name);
    } else {
      // Validate domain format
      if (!validateDomain(domain)) {
        return Response.json(
          { error: 'Invalid domain format' },
          { status: 400 }
        );
      }

      // Check if custom domain is already in use
      const domainExists = await Store.findOne({
        'domainSettings.customDomain': domain
      });
      if (domainExists) {
        return Response.json(
          { error: 'Domain is already in use' },
          { status: 400 }
        );
      }

      // Generate subdomain for backup/default access
      subdomain = await generateUniqueSubdomain(name);
    }

    // Create store
    const store = await Store.create({
      reseller: session.user.id,
      name,
      description,
      domainSettings: isDomainCustom ? {
        subdomain,
        customDomain: domain,
        customDomainVerified: false,
        dnsSettings: {
          aRecord: process.env.STORE_IP_ADDRESS || '123.456.789.0',
          cnameRecord: `${subdomain}.${process.env.STORE_DOMAIN || 'yourdomain.com'}`,
          verificationToken: Math.random().toString(36).substring(2)
        }
      } : {
        subdomain
      },
      settings: {
        defaultMarkup: settings?.defaultMarkup || 20,
        minimumMarkup: settings?.minimumMarkup || 10,
        maximumMarkup: settings?.maximumMarkup || 50,
        autoFulfillment: settings?.autoFulfillment ?? true,
        lowBalanceAlert: settings?.lowBalanceAlert || 100
      },
      status: 'active'
    });

    return Response.json({
      store,
      isDomainCustom,
      message: isDomainCustom 
        ? 'Store created! Please configure your domain DNS settings.'
        : 'Store created successfully!'
    });
  } catch (error) {
    console.error('Failed to create store:', error);
    return Response.json(
      { error: error instanceof Error ? error.message : 'Failed to create store' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'reseller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const store = await Store.findOne({ reseller: session.user.id });
    if (!store) {
      return Response.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return Response.json(store);
  } catch (error) {
    console.error('Failed to fetch store:', error);
    return Response.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'reseller') {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const updates = await req.json();

    // Update store
    const store = await Store.findOneAndUpdate(
      { reseller: session.user.id },
      { $set: updates },
      { new: true }
    );

    if (!store) {
      return Response.json(
        { error: 'Store not found' },
        { status: 404 }
      );
    }

    return Response.json(store);
  } catch (error) {
    console.error('Failed to update store:', error);
    return Response.json(
      { error: 'Failed to update store' },
      { status: 500 }
    );
  }
}