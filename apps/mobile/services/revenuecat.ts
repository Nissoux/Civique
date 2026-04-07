import Purchases, {
  PurchasesOffering,
  CustomerInfo,
  LOG_LEVEL,
  PurchasesPackage,
} from 'react-native-purchases';
import { Platform } from 'react-native';

const REVENUECAT_APPLE_KEY = 'appl_nQxYIjvONBNnMwfRyQIfvWjkkcm';
const REVENUECAT_GOOGLE_KEY = 'goog_NyEtOpLwYjFGSBcAQPygeTmhMYs';
const REVENUECAT_API_KEY = Platform.OS === 'ios' ? REVENUECAT_APPLE_KEY : REVENUECAT_GOOGLE_KEY;
const ENTITLEMENT_ID = 'Civique Pro';

/**
 * Initialize RevenueCat SDK — call once at app startup
 */
export async function initRevenueCat() {
  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({
    apiKey: REVENUECAT_API_KEY,
  });
}

/**
 * Identify user after login (links purchases to user ID)
 */
export async function identifyUser(userId: string) {
  try {
    await Purchases.logIn(userId);
  } catch (err) {
    console.error('RevenueCat identify error:', err);
  }
}

/**
 * Reset user on logout
 */
export async function resetUser() {
  try {
    await Purchases.logOut();
  } catch (err) {
    console.error('RevenueCat logout error:', err);
  }
}

/**
 * Check if user has active "Civique Pro" entitlement
 */
export async function checkPremiumStatus(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    return customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  } catch (err) {
    console.error('RevenueCat check premium error:', err);
    return false;
  }
}

/**
 * Get customer info
 */
export async function getCustomerInfo(): Promise<CustomerInfo | null> {
  try {
    return await Purchases.getCustomerInfo();
  } catch (err) {
    console.error('RevenueCat customer info error:', err);
    return null;
  }
}

/**
 * Get current offerings (products available for purchase)
 */
export async function getOfferings(): Promise<PurchasesOffering | null> {
  try {
    const offerings = await Purchases.getOfferings();
    return offerings.current;
  } catch (err) {
    console.error('RevenueCat offerings error:', err);
    return null;
  }
}

/**
 * Purchase a package
 */
export async function purchasePackage(pkg: PurchasesPackage): Promise<{
  success: boolean;
  isPremium: boolean;
  customerInfo?: CustomerInfo;
}> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
    return { success: true, isPremium, customerInfo };
  } catch (err: any) {
    if (err.userCancelled) {
      return { success: false, isPremium: false };
    }
    console.error('RevenueCat purchase error:', err);
    throw err;
  }
}

/**
 * Restore previous purchases (required by Apple)
 */
export async function restorePurchases(): Promise<{
  isPremium: boolean;
  customerInfo: CustomerInfo;
}> {
  const customerInfo = await Purchases.restorePurchases();
  const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
  return { isPremium, customerInfo };
}

/**
 * Listen for customer info updates
 */
export function addCustomerInfoListener(
  listener: (info: CustomerInfo) => void,
): () => void {
  const remove = Purchases.addCustomerInfoUpdateListener(listener);
  return remove;
}
