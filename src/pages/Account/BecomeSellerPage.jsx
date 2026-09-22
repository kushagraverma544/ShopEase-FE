import {
  AlertTriangle,
  ArrowLeft,
  Briefcase,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ClipboardCheck,
  Clock,
  Headphones,
  Landmark,
  MapPin,
  Package,
  ShieldCheck,
  Tag,
  Truck,
  Users,
  XCircle,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Navigate, NavLink } from 'react-router-dom';

import { ApplicationHistoryTimeline } from '../../components/common/ApplicationHistoryTimeline/ApplicationHistoryTimeline';
import { Banner } from '../../components/common/Banner/Banner';
import { Button } from '../../components/common/Button/Button';
import { Card } from '../../components/common/Card/Card';
import { ConfirmDialog } from '../../components/common/ConfirmDialog/ConfirmDialog';
import { Input } from '../../components/common/Input/Input';
import { Skeleton } from '../../components/common/Skeleton/Skeleton';
import { Switch } from '../../components/common/Switch/Switch';
import { BUSINESS_TYPES } from '../../constants/sellerBusinessTypes.constants';
import { selectIsSeller } from '../../features/auth/authSlice';
import { useLogout } from '../../features/auth/useLogout';
import { useAppSelector } from '../../hooks/useAppSelector';
import { ROUTE_PATHS } from '../../routes/routePaths';
import { cn } from '../../utils/cn';
import {
  applyForSeller,
  getMySellerApplicationHistory,
  getSellerProfile,
  revokeSellerApplication,
} from '../../services/sellerApplicationService';

const EMPTY_FORM = {
  storeName: '',
  businessName: '',
  businessType: '',
  businessEmail: '',
  businessPhone: '',
  sellsOnlyBooks: false,
  registrationNumber: '',
  panNumber: '',
  bankAccountHolderName: '',
  bankAccountNumber: '',
  ifscCode: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  pincode: '',
  categories: '',
  initialProductName: '',
  initialProductBrand: '',
  initialProductCategory: '',
  initialProductDescription: '',
  initialProductPrice: '',
  initialProductDiscountPercentage: '',
  initialProductStock: '',
  initialProductMinOrderQuantity: '1',
  initialProductTags: '',
  initialProductSku: '',
  initialProductWeight: '',
  initialProductWidth: '',
  initialProductHeight: '',
  initialProductDepth: '',
  initialProductWarranty: '',
  initialProductShippingInfo: '',
  initialProductReturnPolicy: '',
};

const STEPS = [
  {
    id: 'business',
    title: 'Business Details',
    description: 'Who you are, on paper.',
    icon: Building2,
  },
  {
    id: 'tax',
    title: 'Tax & Compliance',
    description: "For India's GST/PAN requirements.",
    icon: ShieldCheck,
  },
  {
    id: 'bank',
    title: 'Bank Details',
    description: 'Where your payouts land.',
    icon: Landmark,
  },
  {
    id: 'address',
    title: 'Pickup Address',
    description: 'Where couriers collect orders.',
    icon: MapPin,
  },
  {
    id: 'catalog',
    title: "What You'll Sell",
    description: 'Categories and your first listing.',
    icon: Package,
  },
  {
    id: 'pricing',
    title: 'Pricing & Inventory',
    description: 'Price, stock and how it gets found.',
    icon: Tag,
  },
  {
    id: 'shipping',
    title: 'Shipping & Policies',
    description: 'Size, weight, warranty and photos.',
    icon: Truck,
  },
  {
    id: 'review',
    title: 'Review & Submit',
    description: 'Double-check before sending.',
    icon: ClipboardCheck,
  },
];

function Field({ label, htmlFor, hint, className, children }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label className="text-sm font-medium text-neutral-700" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint ? <p className="text-xs text-neutral-500">{hint}</p> : null}
    </div>
  );
}

function Select({ id, value, onChange, required, children }) {
  return (
    <div className="relative">
      <select
        id={id}
        required={required}
        value={value}
        onChange={onChange}
        className="h-10 w-full appearance-none rounded-md border border-neutral-200 bg-neutral-0 px-4 pr-10 text-base text-neutral-800 transition-colors duration-150 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
        strokeWidth={1.75}
      />
    </div>
  );
}

function Textarea({ id, value, onChange, placeholder, required, rows = 3 }) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={rows}
      className="w-full resize-none rounded-md border border-neutral-200 bg-neutral-0 px-4 py-2.5 text-base text-neutral-800 placeholder:text-neutral-400 transition-colors duration-150 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
    />
  );
}

function SummaryRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-neutral-400">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-800">{value || '—'}</p>
    </div>
  );
}

function ReviewGroup({ title, onEdit, children }) {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-neutral-800">{title}</h4>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-medium text-primary-600 hover:underline"
        >
          Edit
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
    </div>
  );
}

const SELLER_BENEFITS = [
  { icon: Users, text: 'Reach lakhs of customers across India' },
  { icon: Zap, text: 'Fast, reliable payouts to your bank' },
  { icon: Headphones, text: 'Dedicated support for sellers' },
];

// Same gradient treatment as the admin review buttons (see
// SellerApplicationDetailModal) — kept consistent across both sides of this
// flow rather than a flat fill.
const GRADIENT_PRIMARY_BTN =
  'bg-gradient-to-b from-primary-500 to-primary-700 hover:brightness-110 active:brightness-95';
const GRADIENT_DANGER_BTN =
  'bg-gradient-to-b from-danger-500 to-danger-600 hover:brightness-110 active:brightness-95';

// Left-rail companion to the wizard — a vertical progress list (so the
// available width isn't just empty margin) plus a short reason-to-believe
// panel. Reachable steps (already visited) are clickable for quick jumps.
function StepSidebar({ currentStep, furthestStep, onStepClick }) {
  return (
    <div className="flex flex-col gap-6 lg:sticky lg:top-[calc(var(--header-height)+1.5rem)]">
      <Card className="p-5">
        <ol className="flex flex-col">
          {STEPS.map((step, index) => {
            const isComplete = index < currentStep;
            const isCurrent = index === currentStep;
            const isReachable = index <= furthestStep;
            const StepIcon = step.icon;
            return (
              <li key={step.id} className="relative flex gap-3 pb-6 last:pb-0">
                {index < STEPS.length - 1 ? (
                  <span
                    className={cn(
                      'absolute top-8 left-4 h-[calc(100%-1.5rem)] w-px',
                      isComplete ? 'bg-primary-600' : 'bg-neutral-200',
                    )}
                  />
                ) : null}
                <button
                  type="button"
                  onClick={() => isReachable && onStepClick(index)}
                  disabled={!isReachable}
                  aria-label={step.title}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors duration-150',
                    (isComplete || isCurrent) && 'bg-primary-600 text-neutral-0',
                    !isComplete && !isCurrent && 'bg-neutral-100 text-neutral-400',
                    isReachable && !isCurrent && 'cursor-pointer hover:opacity-80',
                    !isReachable && 'cursor-not-allowed',
                  )}
                >
                  {isComplete ? (
                    <Check className="h-4 w-4" strokeWidth={2} />
                  ) : (
                    <StepIcon className="h-4 w-4" strokeWidth={1.75} />
                  )}
                </button>
                <div className="pt-1">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-primary-700' : 'text-neutral-800',
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-neutral-500">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </Card>

      <Card className="p-5">
        <h4 className="mb-4 text-sm font-semibold text-neutral-800">Why sell on ShopEase?</h4>
        <ul className="flex flex-col gap-3">
          {SELLER_BENEFITS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-start gap-2.5 text-sm text-neutral-600">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50">
                <Icon className="h-3.5 w-3.5 text-primary-600" strokeWidth={1.75} />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function SellerApplicationForm({ initial, onCancel, onSubmit, submitting, error }) {
  const [form, setForm] = useState({ ...EMPTY_FORM, ...initial });
  const [chequeFile, setChequeFile] = useState(null);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function goToStep(index) {
    setStepIndex(index);
  }

  function handleStepSubmit(event) {
    event.preventDefault();
    const next = Math.min(stepIndex + 1, STEPS.length - 1);
    setStepIndex(next);
    setFurthestStep((current) => Math.max(current, next));
  }

  function handleBack() {
    setStepIndex((current) => Math.max(current - 1, 0));
  }

  function handleFinalSubmit(event) {
    event.preventDefault();
    onSubmit(form, { cancelledCheque: chequeFile, productImages: productImageFiles });
  }

  const step = STEPS[stepIndex];
  const StepIcon = step.icon;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr] lg:items-start">
      <StepSidebar currentStep={stepIndex} furthestStep={furthestStep} onStepClick={goToStep} />

      <Card className="p-6 sm:p-8">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50">
            <StepIcon className="h-5 w-5 text-primary-600" strokeWidth={1.75} />
          </span>
          <div>
            <p className="text-xs font-semibold tracking-wide text-primary-600 uppercase">
              Step {stepIndex + 1} of {STEPS.length}
            </p>
            <h3 className="text-lg font-semibold text-neutral-900">{step.title}</h3>
          </div>
        </div>

        {step.id === 'business' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <Field
              label="Store / Display Name"
              htmlFor="seller-store-name"
              hint="Shown to buyers on your storefront."
            >
              <Input
                id="seller-store-name"
                placeholder="Kushagra's Electronics Store"
                required
                value={form.storeName}
                onChange={(event) => updateField('storeName', event.target.value)}
              />
            </Field>
            <Field label="Business (Legal) Name" htmlFor="seller-business-name">
              <Input
                id="seller-business-name"
                placeholder="Kushagra Traders"
                required
                value={form.businessName}
                onChange={(event) => updateField('businessName', event.target.value)}
              />
            </Field>
            <Field label="Business Type" htmlFor="seller-business-type">
              <Select
                id="seller-business-type"
                required
                value={form.businessType}
                onChange={(event) => updateField('businessType', event.target.value)}
              >
                <option value="" disabled>
                  Select business type
                </option>
                {BUSINESS_TYPES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Business Email"
                htmlFor="seller-business-email"
                hint="Used for platform communication."
              >
                <Input
                  id="seller-business-email"
                  type="email"
                  placeholder="contact@business.com"
                  required
                  value={form.businessEmail}
                  onChange={(event) => updateField('businessEmail', event.target.value)}
                />
              </Field>
              <Field
                label="Active Mobile Number"
                htmlFor="seller-business-phone"
                hint="Used for OTP verification."
              >
                <Input
                  id="seller-business-phone"
                  type="tel"
                  placeholder="9876543210"
                  required
                  value={form.businessPhone}
                  onChange={(event) => updateField('businessPhone', event.target.value)}
                />
              </Field>
            </div>

            <div className="mt-2 flex justify-end border-t border-neutral-100 pt-5">
              <Button type="submit">
                Continue
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'tax' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-neutral-800">I sell only books</p>
                <p className="text-xs text-neutral-500">
                  GSTIN isn't required for book sellers — PAN is accepted instead.
                </p>
              </div>
              <Switch
                checked={form.sellsOnlyBooks}
                onChange={(value) => updateField('sellsOnlyBooks', value)}
                label="I sell only books"
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label={`GSTIN${form.sellsOnlyBooks ? ' (optional)' : ''}`}
                htmlFor="seller-gstin"
              >
                <Input
                  id="seller-gstin"
                  placeholder="GSTIN123456"
                  required={!form.sellsOnlyBooks}
                  value={form.registrationNumber}
                  onChange={(event) => updateField('registrationNumber', event.target.value)}
                />
              </Field>
              <Field
                label="PAN Number"
                htmlFor="seller-pan"
                hint="Personal PAN for a sole proprietorship, business PAN for a company/LLP."
              >
                <Input
                  id="seller-pan"
                  placeholder="ABCDE1234F"
                  required
                  value={form.panNumber}
                  onChange={(event) => updateField('panNumber', event.target.value)}
                />
              </Field>
            </div>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <Button type="submit">
                Continue
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'bank' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <Field label="Account Holder Name" htmlFor="seller-bank-holder">
              <Input
                id="seller-bank-holder"
                required
                value={form.bankAccountHolderName}
                onChange={(event) => updateField('bankAccountHolderName', event.target.value)}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Account Number" htmlFor="seller-bank-account">
                <Input
                  id="seller-bank-account"
                  required
                  value={form.bankAccountNumber}
                  onChange={(event) => updateField('bankAccountNumber', event.target.value)}
                />
              </Field>
              <Field label="IFSC Code" htmlFor="seller-ifsc">
                <Input
                  id="seller-ifsc"
                  placeholder="HDFC0001234"
                  required
                  value={form.ifscCode}
                  onChange={(event) => updateField('ifscCode', event.target.value.toUpperCase())}
                />
              </Field>
            </div>
            <Field
              label="Cancelled Cheque"
              htmlFor="seller-cheque"
              hint="Image or PDF, used to verify your account."
            >
              <input
                id="seller-cheque"
                type="file"
                accept="image/*,.pdf"
                required
                onChange={(event) => setChequeFile(event.target.files?.[0] ?? null)}
                className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
              />
            </Field>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <Button type="submit">
                Continue
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'address' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <Field label="Address Line 1" htmlFor="seller-address-1">
              <Input
                id="seller-address-1"
                required
                value={form.addressLine1}
                onChange={(event) => updateField('addressLine1', event.target.value)}
              />
            </Field>
            <Field label="Address Line 2" htmlFor="seller-address-2">
              <Input
                id="seller-address-2"
                value={form.addressLine2}
                onChange={(event) => updateField('addressLine2', event.target.value)}
              />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="City" htmlFor="seller-city">
                <Input
                  id="seller-city"
                  required
                  value={form.city}
                  onChange={(event) => updateField('city', event.target.value)}
                />
              </Field>
              <Field label="State" htmlFor="seller-state">
                <Input
                  id="seller-state"
                  required
                  value={form.state}
                  onChange={(event) => updateField('state', event.target.value)}
                />
              </Field>
              <Field label="Pincode" htmlFor="seller-pincode">
                <Input
                  id="seller-pincode"
                  required
                  value={form.pincode}
                  onChange={(event) => updateField('pincode', event.target.value)}
                />
              </Field>
            </div>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <Button type="submit">
                Continue
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'catalog' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <Field
              label="Categories you plan to sell in"
              htmlFor="seller-categories"
              hint="Comma-separated, e.g. Electronics, Accessories, Furniture."
            >
              <Input
                id="seller-categories"
                placeholder="Electronics, Accessories, Furniture"
                required
                value={form.categories}
                onChange={(event) => updateField('categories', event.target.value)}
              />
            </Field>
            <p className="text-xs font-semibold tracking-wide text-neutral-500 uppercase">
              Your first product
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Product Name" htmlFor="seller-product-name">
                <Input
                  id="seller-product-name"
                  placeholder="Apple MacBook Pro M5 Pro"
                  required
                  value={form.initialProductName}
                  onChange={(event) => updateField('initialProductName', event.target.value)}
                />
              </Field>
              <Field label="Brand" htmlFor="seller-product-brand">
                <Input
                  id="seller-product-brand"
                  placeholder="Apple"
                  required
                  value={form.initialProductBrand}
                  onChange={(event) => updateField('initialProductBrand', event.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Category"
              htmlFor="seller-product-category"
              hint="Should be one of the categories above."
            >
              <Input
                id="seller-product-category"
                required
                value={form.initialProductCategory}
                onChange={(event) => updateField('initialProductCategory', event.target.value)}
              />
            </Field>
            <Field label="Description" htmlFor="seller-product-description">
              <Textarea
                id="seller-product-description"
                placeholder="What makes this product worth buying?"
                required
                value={form.initialProductDescription}
                onChange={(event) => updateField('initialProductDescription', event.target.value)}
              />
            </Field>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <Button type="submit">
                Continue
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'pricing' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Price (₹)" htmlFor="seller-product-price">
                <Input
                  id="seller-product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.initialProductPrice}
                  onChange={(event) => updateField('initialProductPrice', event.target.value)}
                />
              </Field>
              <Field label="Discount (%)" htmlFor="seller-product-discount">
                <Input
                  id="seller-product-discount"
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  placeholder="0"
                  value={form.initialProductDiscountPercentage}
                  onChange={(event) =>
                    updateField('initialProductDiscountPercentage', event.target.value)
                  }
                />
              </Field>
              <Field label="Stock Quantity" htmlFor="seller-product-stock">
                <Input
                  id="seller-product-stock"
                  type="number"
                  min="0"
                  required
                  value={form.initialProductStock}
                  onChange={(event) => updateField('initialProductStock', event.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Minimum Order Quantity"
                htmlFor="seller-product-moq"
                hint="Smallest quantity a buyer can order at once."
              >
                <Input
                  id="seller-product-moq"
                  type="number"
                  min="1"
                  required
                  value={form.initialProductMinOrderQuantity}
                  onChange={(event) =>
                    updateField('initialProductMinOrderQuantity', event.target.value)
                  }
                />
              </Field>
              <Field
                label="SKU"
                htmlFor="seller-product-sku"
                hint="Optional — your own stock-keeping code."
              >
                <Input
                  id="seller-product-sku"
                  placeholder="ELEC-APL-MBP-001"
                  value={form.initialProductSku}
                  onChange={(event) => updateField('initialProductSku', event.target.value)}
                />
              </Field>
            </div>
            <Field
              label="Tags"
              htmlFor="seller-product-tags"
              hint="Comma-separated, helps buyers find this product in search."
            >
              <Input
                id="seller-product-tags"
                placeholder="laptop, apple, m5-pro"
                value={form.initialProductTags}
                onChange={(event) => updateField('initialProductTags', event.target.value)}
              />
            </Field>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <Button type="submit">
                Continue
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'shipping' ? (
          <form onSubmit={handleStepSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <Field label="Weight (kg)" htmlFor="seller-product-weight">
                <Input
                  id="seller-product-weight"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.initialProductWeight}
                  onChange={(event) => updateField('initialProductWeight', event.target.value)}
                />
              </Field>
              <Field label="Width (cm)" htmlFor="seller-product-width">
                <Input
                  id="seller-product-width"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.initialProductWidth}
                  onChange={(event) => updateField('initialProductWidth', event.target.value)}
                />
              </Field>
              <Field label="Height (cm)" htmlFor="seller-product-height">
                <Input
                  id="seller-product-height"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.initialProductHeight}
                  onChange={(event) => updateField('initialProductHeight', event.target.value)}
                />
              </Field>
              <Field label="Depth (cm)" htmlFor="seller-product-depth">
                <Input
                  id="seller-product-depth"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={form.initialProductDepth}
                  onChange={(event) => updateField('initialProductDepth', event.target.value)}
                />
              </Field>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Warranty Information" htmlFor="seller-product-warranty">
                <Input
                  id="seller-product-warranty"
                  placeholder="1 year warranty"
                  required
                  value={form.initialProductWarranty}
                  onChange={(event) => updateField('initialProductWarranty', event.target.value)}
                />
              </Field>
              <Field label="Shipping Information" htmlFor="seller-product-shipping">
                <Input
                  id="seller-product-shipping"
                  placeholder="Ships in 3-5 business days"
                  required
                  value={form.initialProductShippingInfo}
                  onChange={(event) =>
                    updateField('initialProductShippingInfo', event.target.value)
                  }
                />
              </Field>
            </div>
            <Field label="Return Policy" htmlFor="seller-product-return-policy">
              <Input
                id="seller-product-return-policy"
                placeholder="30 days return policy"
                required
                value={form.initialProductReturnPolicy}
                onChange={(event) => updateField('initialProductReturnPolicy', event.target.value)}
              />
            </Field>
            <Field
              label="Product Images"
              htmlFor="seller-product-images"
              hint="First image is used as the thumbnail."
            >
              <input
                id="seller-product-images"
                type="file"
                accept="image/*"
                multiple
                required
                onChange={(event) => setProductImageFiles(Array.from(event.target.files ?? []))}
                className="block w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-primary-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-primary-700 hover:file:bg-primary-100"
              />
            </Field>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <Button type="submit">
                Review Application
                <ChevronLeft className="h-4 w-4 rotate-180" strokeWidth={2} />
              </Button>
            </div>
          </form>
        ) : null}

        {step.id === 'review' ? (
          <form onSubmit={handleFinalSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-neutral-500">
              Review everything below before submitting — you can jump back to fix anything.
            </p>

            <ReviewGroup title="Business Details" onEdit={() => goToStep(0)}>
              <SummaryRow label="Store Name" value={form.storeName} />
              <SummaryRow label="Business Name" value={form.businessName} />
              <SummaryRow
                label="Business Type"
                value={BUSINESS_TYPES.find((t) => t.value === form.businessType)?.label}
              />
              <SummaryRow label="Business Email" value={form.businessEmail} />
              <SummaryRow label="Active Mobile Number" value={form.businessPhone} />
            </ReviewGroup>

            <ReviewGroup title="Tax & Compliance" onEdit={() => goToStep(1)}>
              <SummaryRow label="Sells Only Books" value={form.sellsOnlyBooks ? 'Yes' : 'No'} />
              <SummaryRow label="GSTIN" value={form.registrationNumber} />
              <SummaryRow label="PAN Number" value={form.panNumber} />
            </ReviewGroup>

            <ReviewGroup title="Bank Details" onEdit={() => goToStep(2)}>
              <SummaryRow label="Account Holder" value={form.bankAccountHolderName} />
              <SummaryRow label="Account Number" value={form.bankAccountNumber} />
              <SummaryRow label="IFSC Code" value={form.ifscCode} />
              <SummaryRow label="Cancelled Cheque" value={chequeFile?.name} />
            </ReviewGroup>

            <ReviewGroup title="Pickup Address" onEdit={() => goToStep(3)}>
              <SummaryRow
                label="Address"
                value={[form.addressLine1, form.addressLine2].filter(Boolean).join(', ')}
              />
              <SummaryRow
                label="City / State"
                value={[form.city, form.state].filter(Boolean).join(', ')}
              ></SummaryRow>
              <SummaryRow label="Pincode" value={form.pincode} />
            </ReviewGroup>

            <ReviewGroup title="What You'll Sell" onEdit={() => goToStep(4)}>
              <SummaryRow label="Categories" value={form.categories} />
              <SummaryRow label="First Product" value={form.initialProductName} />
              <SummaryRow label="Brand" value={form.initialProductBrand} />
              <SummaryRow label="Category" value={form.initialProductCategory} />
              <SummaryRow label="Description" value={form.initialProductDescription} />
            </ReviewGroup>

            <ReviewGroup title="Pricing & Inventory" onEdit={() => goToStep(5)}>
              <SummaryRow
                label="Price"
                value={form.initialProductPrice ? `₹${form.initialProductPrice}` : ''}
              />
              <SummaryRow
                label="Discount"
                value={
                  form.initialProductDiscountPercentage
                    ? `${form.initialProductDiscountPercentage}%`
                    : ''
                }
              />
              <SummaryRow label="Stock" value={form.initialProductStock} />
              <SummaryRow
                label="Minimum Order Quantity"
                value={form.initialProductMinOrderQuantity}
              />
              <SummaryRow label="SKU" value={form.initialProductSku} />
              <SummaryRow label="Tags" value={form.initialProductTags} />
            </ReviewGroup>

            <ReviewGroup title="Shipping & Policies" onEdit={() => goToStep(6)}>
              <SummaryRow
                label="Dimensions (W×H×D)"
                value={
                  form.initialProductWidth
                    ? `${form.initialProductWidth} × ${form.initialProductHeight} × ${form.initialProductDepth} cm`
                    : ''
                }
              />
              <SummaryRow
                label="Weight"
                value={form.initialProductWeight ? `${form.initialProductWeight} kg` : ''}
              />
              <SummaryRow label="Warranty" value={form.initialProductWarranty} />
              <SummaryRow label="Shipping" value={form.initialProductShippingInfo} />
              <SummaryRow label="Return Policy" value={form.initialProductReturnPolicy} />
              <SummaryRow
                label="Product Images"
                value={
                  productImageFiles.length ? `${productImageFiles.length} file(s) selected` : ''
                }
              />
            </ReviewGroup>

            {error ? <p className="text-sm text-danger-600">{error}</p> : null}

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-5">
              <Button type="button" variant="secondary" onClick={handleBack} disabled={submitting}>
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                Back
              </Button>
              <div className="flex gap-3">
                {onCancel ? (
                  <Button type="button" variant="ghost" onClick={onCancel} disabled={submitting}>
                    Cancel
                  </Button>
                ) : null}
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting…' : 'Submit Application'}
                </Button>
              </div>
            </div>
          </form>
        ) : null}
      </Card>
    </div>
  );
}

// `application` is always the full GET /seller/profile response now (not the
// old lightweight status shape), so every field here comes straight from BE
// and survives a page reload — no more `draft` fallback needed for display.
function ApplicationSummary({ application }) {
  const pickupAddress = [application?.pickupAddressLine1, application?.pickupAddressLine2]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <SummaryRow label="Store Name" value={application?.storeName} />
      <SummaryRow label="Business Name" value={application?.businessName} />
      <SummaryRow label="Business Email" value={application?.businessEmail} />
      <SummaryRow label="Business Phone" value={application?.businessPhone} />
      <SummaryRow label="GSTIN" value={application?.registrationNumber} />
      <SummaryRow label="PAN Number" value={application?.panNumber} />
      <SummaryRow label="Bank Account" value={application?.bankAccountNumber} />
      <SummaryRow label="IFSC Code" value={application?.ifscCode} />
      <SummaryRow label="Pickup Address" value={pickupAddress} />
      <SummaryRow
        label="City / State"
        value={[application?.pickupCity, application?.pickupState].filter(Boolean).join(', ')}
      />
      <SummaryRow
        label="Applied On"
        value={application?.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : null}
      />
      <SummaryRow
        label="Reviewed On"
        value={
          application?.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : null
        }
      />
    </div>
  );
}

// SellerProfileResponse doesn't echo back the initial product's own fields
// (name/price/etc.) — only `productId` — so a resubmit/re-apply pre-fill from
// this can't restore the product wizard steps; only the seller-level fields
// below survive a page reload. `draft` (this session's form) still wins when
// present, since it has everything.
function profileToFormInitial(application) {
  if (!application) return undefined;
  return {
    storeName: application.storeName ?? '',
    businessName: application.businessName ?? '',
    businessType: application.businessType ?? '',
    businessEmail: application.businessEmail ?? '',
    businessPhone: application.businessPhone ?? '',
    sellsOnlyBooks: application.sellsOnlyBooks ?? false,
    registrationNumber: application.registrationNumber ?? '',
    panNumber: application.panNumber ?? '',
    bankAccountHolderName: application.bankAccountHolderName ?? '',
    bankAccountNumber: application.bankAccountNumber ?? '',
    ifscCode: application.ifscCode ?? '',
    addressLine1: application.pickupAddressLine1 ?? '',
    addressLine2: application.pickupAddressLine2 ?? '',
    city: application.pickupCity ?? '',
    state: application.pickupState ?? '',
    pincode: application.pickupPincode ?? '',
    categories: (application.categories ?? []).join(', '),
  };
}

// Full-page seller registration flow, linked from the compact status card on
// /account. A SELLER-role JWT shouldn't land here at all (they already have
// what this page gets them), so it bounces straight back to /account.
export function BecomeSellerPage() {
  const isSeller = useAppSelector(selectIsSeller);
  const handleLogout = useLogout();
  const [status, setStatus] = useState('loading');
  const [application, setApplication] = useState(null);
  const [draft, setDraft] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [banner, setBanner] = useState(null);
  const [revoking, setRevoking] = useState(false);
  const [confirmingRevoke, setConfirmingRevoke] = useState(false);
  const [history, setHistory] = useState([]);

  const fetchStatus = useCallback(() => {
    return getSellerProfile()
      .then((data) => {
        setApplication(data);
        // REVOKED behaves like NONE on the FE — a self-initiated revoke has
        // no remark worth showing, so just re-open the empty apply form.
        setStatus(data.status === 'REVOKED' ? 'NONE' : data.status);
        // Best-effort — a history-fetch failure shouldn't block the rest of
        // the page from showing.
        getMySellerApplicationHistory()
          .then(setHistory)
          .catch(() => setHistory([]));
      })
      .catch(() => {
        // 404 (never applied) is expected here; anything else (BE down,
        // endpoint not shipped) also falls back to NONE so the form stays
        // reachable instead of a dead end.
        setApplication(null);
        setHistory([]);
        setStatus('NONE');
      });
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  async function handleApply(form, files) {
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        storeName: form.storeName,
        businessName: form.businessName,
        businessType: form.businessType,
        businessEmail: form.businessEmail,
        businessPhone: form.businessPhone,
        sellsOnlyBooks: form.sellsOnlyBooks,
        registrationNumber: form.sellsOnlyBooks
          ? form.registrationNumber || null
          : form.registrationNumber,
        panNumber: form.panNumber,
        bankAccountHolderName: form.bankAccountHolderName,
        bankAccountNumber: form.bankAccountNumber,
        ifscCode: form.ifscCode,
        pickupAddress: {
          addressLine1: form.addressLine1,
          addressLine2: form.addressLine2,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
        categories: form.categories
          .split(',')
          .map((category) => category.trim())
          .filter(Boolean),
        // Mirrors the catalog's product schema (see productService.js) minus
        // what's system-generated (meta, reviews, availabilityStatus — the
        // last is derivable from stock) so this listing can slot in the same
        // shape once BE creates it alongside the seller account.
        initialProduct: {
          name: form.initialProductName,
          brand: form.initialProductBrand,
          category: form.initialProductCategory,
          description: form.initialProductDescription,
          price: Number(form.initialProductPrice),
          discountPercentage: form.initialProductDiscountPercentage
            ? Number(form.initialProductDiscountPercentage)
            : 0,
          stock: Number(form.initialProductStock),
          minimumOrderQuantity: Number(form.initialProductMinOrderQuantity || 1),
          sku: form.initialProductSku || null,
          tags: form.initialProductTags
            .split(',')
            .map((tag) => tag.trim())
            .filter(Boolean),
          weight: Number(form.initialProductWeight),
          dimensions: {
            width: Number(form.initialProductWidth),
            height: Number(form.initialProductHeight),
            depth: Number(form.initialProductDepth),
          },
          warrantyInformation: form.initialProductWarranty,
          shippingInformation: form.initialProductShippingInfo,
          returnPolicy: form.initialProductReturnPolicy,
        },
      };
      // POST /seller/apply's own response is the lightweight status shape
      // (no businessName/bankAccountNumber/etc.), so re-fetch the full
      // profile afterward rather than binding `application` to it directly
      // — otherwise the summary would go blank right after submitting, the
      // same bug this page was just fixed for.
      await applyForSeller(payload, files);
      setDraft(form);
      setIsEditing(false);
      setBanner({
        variant: 'success',
        message: "Application submitted — we'll review it shortly.",
      });
      await fetchStatus();
    } catch (err) {
      // Covers the 409 "already PENDING/APPROVED" case too — BE's message is
      // shown as-is rather than re-worded here.
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke() {
    setRevoking(true);
    try {
      await revokeSellerApplication();
      setApplication(null);
      setDraft(null);
      setStatus('NONE');
      setConfirmingRevoke(false);
      setBanner({ variant: 'success', message: 'Application withdrawn.' });
    } catch (err) {
      setBanner({ variant: 'error', message: err.message });
    } finally {
      setRevoking(false);
    }
  }

  function handleReLogin() {
    handleLogout();
  }

  if (isSeller) return <Navigate to={ROUTE_PATHS.ACCOUNT} replace />;

  const isWizardVisible =
    status === 'NONE' || ((status === 'REJECTED' || status === 'HOLD') && isEditing);

  return (
    <div
      className={cn(
        'mx-auto px-4 py-8 sm:px-6 lg:px-8',
        isWizardVisible ? 'max-w-6xl' : 'max-w-3xl',
      )}
    >
      <NavLink
        to={ROUTE_PATHS.ACCOUNT}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800"
      >
        <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
        Back to My Account
      </NavLink>

      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50">
          <Briefcase className="h-6 w-6 text-primary-600" strokeWidth={1.75} />
        </span>
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">Become a Seller</h1>
          <p className="text-sm text-neutral-500">
            Set up your storefront and start selling on ShopEase.
          </p>
        </div>
      </div>

      {banner ? (
        <Banner
          variant={banner.variant}
          message={banner.message}
          onDismiss={() => setBanner(null)}
          className="mb-6"
        />
      ) : null}

      {status === 'loading' ? (
        <Card className="flex flex-col gap-3 p-6">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 rounded-lg" />
        </Card>
      ) : null}

      {status === 'NONE' ? (
        <SellerApplicationForm onSubmit={handleApply} submitting={submitting} error={formError} />
      ) : null}

      {status === 'PENDING' ? (
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-start gap-3 rounded-lg bg-warning-50 p-4">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-warning-600" strokeWidth={1.75} />
            <div>
              <p className="text-sm font-medium text-warning-600">
                {application?.correctionSubmittedAt
                  ? 'Your corrected application is under review'
                  : 'Application under review'}
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                We'll notify you once it's reviewed.
              </p>
            </div>
          </div>

          <ApplicationSummary application={application} />

          {history.length ? (
            <div className="border-t border-neutral-100 pt-5">
              <ApplicationHistoryTimeline history={history} />
            </div>
          ) : null}

          <div className="flex justify-end border-t border-neutral-100 pt-5">
            <Button
              variant="danger"
              onClick={() => setConfirmingRevoke(true)}
              className={GRADIENT_DANGER_BTN}
            >
              Revoke Application
            </Button>
          </div>
        </Card>
      ) : null}

      {status === 'HOLD' && !isEditing ? (
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-start gap-3 rounded-lg bg-warning-50 p-4">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-warning-600"
              strokeWidth={1.75}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-warning-600">
                Action needed on your application
              </p>
              <p className="mt-2.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Reviewer's Remark
              </p>
              <p className="mt-1 text-sm font-medium text-danger-600">
                {application?.adminRemark || 'The reviewer asked for a correction.'}
              </p>
            </div>
          </div>

          <ApplicationSummary application={application} />

          {history.length ? (
            <div className="border-t border-neutral-100 pt-5">
              <ApplicationHistoryTimeline history={history} />
            </div>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <Button onClick={() => setIsEditing(true)} className={GRADIENT_PRIMARY_BTN}>
              Update & Resubmit
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmingRevoke(true)}
              className={GRADIENT_DANGER_BTN}
            >
              Revoke Application
            </Button>
          </div>
        </Card>
      ) : null}

      {status === 'HOLD' && isEditing ? (
        <SellerApplicationForm
          initial={draft ?? profileToFormInitial(application)}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleApply}
          submitting={submitting}
          error={formError}
        />
      ) : null}

      {status === 'REJECTED' && !isEditing ? (
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-start gap-3 rounded-lg bg-danger-50 p-4">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger-600" strokeWidth={1.75} />
            <div className="flex-1">
              <p className="text-sm font-medium text-danger-600">Application rejected</p>
              <p className="mt-2.5 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                Reviewer's Remark
              </p>
              <p className="mt-1 text-sm font-medium text-danger-600">
                {application?.adminRemark || 'No reason was provided.'}
              </p>
            </div>
          </div>

          <ApplicationSummary application={application} />

          {history.length ? (
            <div className="border-t border-neutral-100 pt-5">
              <ApplicationHistoryTimeline history={history} />
            </div>
          ) : null}

          <div className="flex justify-end gap-3 border-t border-neutral-100 pt-5">
            <Button onClick={() => setIsEditing(true)} className={GRADIENT_PRIMARY_BTN}>
              Re-apply
            </Button>
            <Button
              variant="danger"
              onClick={() => setConfirmingRevoke(true)}
              className={GRADIENT_DANGER_BTN}
            >
              Revoke Application
            </Button>
          </div>
        </Card>
      ) : null}

      {status === 'REJECTED' && isEditing ? (
        <SellerApplicationForm
          initial={draft ?? profileToFormInitial(application)}
          onCancel={() => setIsEditing(false)}
          onSubmit={handleApply}
          submitting={submitting}
          error={formError}
        />
      ) : null}

      {status === 'APPROVED' ? (
        <Card className="flex flex-col gap-5 p-6">
          <div className="flex items-start gap-3 rounded-lg bg-success-50 p-4">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success-600" strokeWidth={1.75} />
            <p className="text-sm font-medium text-success-600">
              You're approved! Please log in again to access your Seller Dashboard.
            </p>
          </div>

          <ApplicationSummary application={application} />

          {history.length ? (
            <div className="border-t border-neutral-100 pt-5">
              <ApplicationHistoryTimeline history={history} />
            </div>
          ) : null}

          <div className="flex justify-end border-t border-neutral-100 pt-5">
            <Button onClick={handleReLogin} className={GRADIENT_PRIMARY_BTN}>
              Log In Again
            </Button>
          </div>
        </Card>
      ) : null}

      <ConfirmDialog
        open={confirmingRevoke}
        onClose={() => setConfirmingRevoke(false)}
        onConfirm={handleRevoke}
        title="Revoke Application"
        description="This withdraws your seller application. You can apply again anytime."
        confirmLabel={revoking ? 'Revoking…' : 'Revoke'}
      />
    </div>
  );
}

export default BecomeSellerPage;
