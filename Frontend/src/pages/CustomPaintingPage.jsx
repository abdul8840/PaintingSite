import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomOrderOptions, calculateCustomPrice, createCustomOrder } from '../store/slices/customOrderSlice';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { useDebounce } from '../hooks/useDebounce';
import ImageUploader from '../components/custom/ImageUploader';
import StyleSelector from '../components/custom/StyleSelector';
import SizeSelector from '../components/custom/SizeSelector';
import FrameSelector from '../components/custom/FrameSelector';
import OptionsSelector from '../components/custom/OptionsSelector';
import PriceCalculator from '../components/custom/PriceCalculator';
import AiStyleSuggester from '../components/custom/AiStyleSuggester';
import AddressForm from '../components/checkout/AddressForm';
import Breadcrumb from '../components/common/Breadcrumb';
import { HiPhotograph, HiSparkles, HiCube, HiViewBoards, HiAdjustments, HiLocationMarker, HiEye, HiArrowLeft, HiArrowRight, HiShieldCheck, HiCreditCard, HiCheck, HiPencil } from 'react-icons/hi';

const STYLE_LABELS = {
  'pencil-sketch': 'Pencil Sketch',
  'charcoal-sketch': 'Charcoal Sketch',
  'watercolor': 'Watercolor',
  'oil-painting': 'Oil Painting',
  'digital-illustration': 'Digital Illustration',
  'line-art': 'Line Art',
  'pop-art': 'Pop Art',
  'caricature': 'Caricature',
  'realistic': 'Realistic',
  'abstract': 'Abstract',
};

const FRAME_LABELS = {
  'no-frame': 'No Frame',
  'basic-black': 'Basic Black',
  'basic-white': 'Basic White',
  'wooden-natural': 'Wooden Natural',
  'wooden-dark': 'Wooden Dark',
  'golden-classic': 'Golden Classic',
  'silver-modern': 'Silver Modern',
  'floating-frame': 'Floating Frame',
};

const COLOR_LABELS = {
  'full-color': 'Full Color',
  'black-and-white': 'Black & White',
  'sepia': 'Sepia',
  'monochrome': 'Monochrome',
  'vintage': 'Vintage',
  'vibrant': 'Vibrant',
  'pastel': 'Pastel',
  'muted': 'Muted',
};

export default function CustomPaintingPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();
  const { pricing, pricingLoading, loading } = useSelector((state) => state.customOrders);

  const [referenceImage, setReferenceImage] = useState(null);
  const [canvasSize, setCanvasSize] = useState('16x20');
  const [customSize, setCustomSize] = useState({ width: 20, height: 24, unit: 'inches' });
  const [sketchStyle, setSketchStyle] = useState('pencil-sketch');
  const [colorStyle, setColorStyle] = useState('full-color');
  const [framingOption, setFramingOption] = useState('no-frame');
  const [backgroundPreference, setBackgroundPreference] = useState('keep-original');
  const [numberOfSubjects, setNumberOfSubjects] = useState(1);
  const [isRushOrder, setIsRushOrder] = useState(false);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [shippingAddress, setShippingAddress] = useState(user?.addresses?.find(a => a.isDefault) || null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    dispatch(fetchCustomOrderOptions());
  }, [dispatch]);

  const debouncedSize = useDebounce(canvasSize, 300);
  const debouncedStyle = useDebounce(sketchStyle, 300);
  const debouncedFrame = useDebounce(framingOption, 300);

  // Auto calculate price - fix: use actual state values not debounced
  useEffect(() => {
    if (canvasSize && sketchStyle) {
      dispatch(calculateCustomPrice({
        canvasSize,
        customSize: canvasSize === 'custom' ? customSize : undefined,
        sketchStyle,
        framingOption,
        numberOfSubjects,
        isRushOrder,
      }));
    }
  }, [dispatch, canvasSize, customSize?.width, customSize?.height, sketchStyle, framingOption, numberOfSubjects, isRushOrder]);

  const handleSubmit = async () => {
    if (!isAuthenticated) { toast.error('Please login to place an order'); navigate('/login'); return; }
    if (!referenceImage) { toast.error('Please upload a reference image'); return; }
    if (!shippingAddress) { toast.error('Please add a shipping address'); return; }

    try {
      const res = await dispatch(createCustomOrder({
        referenceImage,
        canvasSize,
        customSize: canvasSize === 'custom' ? customSize : undefined,
        colorStyle,
        sketchStyle,
        framingOption,
        backgroundPreference,
        numberOfSubjects,
        additionalNotes,
        isRushOrder,
        shippingAddress,
        aiSuggestedStyles: aiSuggestions,
      })).unwrap();

      if (res.url) window.location.href = res.url;
    } catch (err) {
      toast.error(err || 'Failed to create order');
    }
  };

  const steps = [
    { title: 'Customize', icon: HiSparkles },
    { title: 'Shipping', icon: HiLocationMarker },
    { title: 'Review', icon: HiEye },
  ];

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Custom Painting' }]} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-rust/10 rounded-full mb-4">
              <HiSparkles className="w-4 h-4 text-rust" />
              <span className="text-sm font-medium text-rust">Custom Commission</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink mb-2">Custom Painting Order</h1>
            <p className="text-base sm:text-lg text-charcoal/70">Transform your photos into stunning artwork</p>
          </div>

          {/* Step Indicator */}
          <div className="mt-8 sm:mt-10 flex items-center justify-center">
            <div className="flex items-center gap-2 sm:gap-4">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <button
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full transition-all duration-300 ${
                      i === step
                        ? 'bg-ink text-white'
                        : i < step
                        ? 'bg-sage/10 text-sage cursor-pointer hover:bg-sage/20'
                        : 'bg-cream text-charcoal/40 cursor-not-allowed'
                    }`}
                  >
                    {i < step ? (
                      <HiCheck className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                    <span className="hidden sm:inline text-sm font-medium">{s.title}</span>
                  </button>
                  
                  {i < steps.length - 1 && (
                    <div className={`w-8 sm:w-12 h-0.5 mx-2 transition-colors duration-300 ${
                      i < step ? 'bg-sage' : 'bg-cream'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
        {/* Step 0: Customize */}
        {step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Section 1: Upload */}
              <section className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-rust/10 rounded-xl flex items-center justify-center">
                    <HiPhotograph className="w-5 h-5 sm:w-6 sm:h-6 text-rust" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink">1. Upload Your Photo</h2>
                    <p className="text-sm text-charcoal/60">High quality images work best</p>
                  </div>
                </div>
                
                <ImageUploader value={referenceImage} onChange={setReferenceImage} />
                
                {referenceImage && (
                  <div className="mt-6">
                    <AiStyleSuggester
                      imageUrl={referenceImage.url}
                      onSelectStyle={setSketchStyle}
                      onSuggestionsReceived={setAiSuggestions}
                    />
                  </div>
                )}
              </section>

              {/* Section 2: Style */}
              <section className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gold/10 rounded-xl flex items-center justify-center">
                    <HiSparkles className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink">2. Choose Your Style</h2>
                    <p className="text-sm text-charcoal/60">Select the art style you prefer</p>
                  </div>
                </div>
                
                <StyleSelector value={sketchStyle} onChange={setSketchStyle} aiSuggestions={aiSuggestions} />
              </section>

              {/* Section 3: Size */}
              <section className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-sage/10 rounded-xl flex items-center justify-center">
                    <HiCube className="w-5 h-5 sm:w-6 sm:h-6 text-sage" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink">3. Select Canvas Size</h2>
                    <p className="text-sm text-charcoal/60">Choose the perfect dimensions</p>
                  </div>
                </div>
                
                <SizeSelector 
                  value={canvasSize} 
                  onChange={setCanvasSize} 
                  customSize={customSize} 
                  onCustomSizeChange={setCustomSize} 
                />
              </section>

              {/* Section 4: Frame */}
              <section className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-charcoal/10 rounded-xl flex items-center justify-center">
                    <HiViewBoards className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink">4. Framing Option</h2>
                    <p className="text-sm text-charcoal/60">Add a beautiful frame</p>
                  </div>
                </div>
                
                <FrameSelector value={framingOption} onChange={setFramingOption} />
              </section>

              {/* Section 5: Additional Options */}
              <section className="bg-white rounded-2xl border border-cream p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-5 sm:mb-6">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 bg-mist/30 rounded-xl flex items-center justify-center">
                    <HiAdjustments className="w-5 h-5 sm:w-6 sm:h-6 text-charcoal" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-ink">5. Additional Options</h2>
                    <p className="text-sm text-charcoal/60">Customize your order</p>
                  </div>
                </div>
                
                <OptionsSelector
                  colorStyle={colorStyle} onColorChange={setColorStyle}
                  background={backgroundPreference} onBackgroundChange={setBackgroundPreference}
                  subjects={numberOfSubjects} onSubjectsChange={setNumberOfSubjects}
                  isRush={isRushOrder} onRushChange={setIsRushOrder}
                  notes={additionalNotes} onNotesChange={setAdditionalNotes}
                />
              </section>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4 sm:space-y-6">
                <PriceCalculator pricing={pricing} loading={pricingLoading} />
                
                <button 
                  onClick={() => setStep(1)} 
                  disabled={!referenceImage}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  Continue to Shipping
                  <HiArrowRight className="w-5 h-5" />
                </button>

                {/* Security Badge */}
                <div className="p-4 bg-white rounded-xl border border-cream">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiShieldCheck className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">100% Satisfaction Guarantee</p>
                      <p className="text-xs text-charcoal/50">Free revisions included</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Shipping */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-2xl border border-cream p-6 sm:p-8 lg:p-10">
              {/* Back Button */}
              <button 
                onClick={() => setStep(0)}
                className="flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors mb-6 cursor-pointer"
              >
                <HiArrowLeft className="w-4 h-4" />
                Back to Customization
              </button>

              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-11 h-11 bg-sage/10 rounded-xl flex items-center justify-center">
                  <HiLocationMarker className="w-6 h-6 text-sage" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-ink">Shipping Address</h2>
                  <p className="text-sm text-charcoal/60">Where should we deliver your artwork?</p>
                </div>
              </div>
              
              {/* Saved Addresses */}
              {user?.addresses?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-charcoal/70 mb-4">Saved Addresses</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {user.addresses.map((addr, index) => (
                      <button 
                        key={addr._id} 
                        onClick={() => { setShippingAddress(addr); setStep(2); }}
                        className={`group text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-[0.98] hover:shadow-md animate-fade-in-up ${
                          shippingAddress?._id === addr._id 
                            ? 'border-sage bg-sage/5' 
                            : 'border-cream hover:border-sage/50'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {addr.isDefault && (
                          <span className="inline-block px-2 py-0.5 bg-sage/10 text-sage text-xs font-medium rounded-full mb-2">
                            Default
                          </span>
                        )}
                        <p className="font-medium text-ink text-sm">{addr.street}</p>
                        <p className="text-charcoal/60 text-sm">{addr.city}, {addr.state} {addr.zipCode}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Divider */}
              <div className="relative my-6 sm:my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-cream" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 text-sm text-charcoal/50">Or enter a new address</span>
                </div>
              </div>
              
              <AddressForm 
                address={shippingAddress} 
                onSubmit={(addr) => { setShippingAddress(addr); setStep(2); }} 
                onCancel={() => setStep(0)} 
              />
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 animate-fade-in-up">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Button */}
              <button 
                onClick={() => setStep(1)}
                className="flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors cursor-pointer"
              >
                <HiArrowLeft className="w-4 h-4" />
                Back to Shipping
              </button>

              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 bg-gold/10 rounded-xl flex items-center justify-center">
                  <HiEye className="w-6 h-6 text-gold" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-ink">Review Your Order</h2>
              </div>

              {/* Order Details Card */}
              <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
                  {/* Image Preview */}
                  <div className="w-full sm:w-40 h-48 sm:h-40 rounded-xl overflow-hidden flex-shrink-0">
                    <img 
                      src={referenceImage?.url} 
                      alt="Reference" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-charcoal/50">Style</p>
                        <p className="font-medium text-ink capitalize">{STYLE_LABELS[sketchStyle]}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50">Size</p>
                        <p className="font-medium text-ink">{canvasSize === 'custom' ? `${customSize.width}" × ${customSize.height}"` : canvasSize}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50">Color</p>
                        <p className="font-medium text-ink capitalize">{COLOR_LABELS[colorStyle]}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50">Frame</p>
                        <p className="font-medium text-ink capitalize">{FRAME_LABELS[framingOption]}</p>
                      </div>
                      <div>
                        <p className="text-charcoal/50">Subjects</p>
                        <p className="font-medium text-ink">{numberOfSubjects}</p>
                      </div>
                      {isRushOrder && (
                        <div>
                          <p className="text-charcoal/50">Rush Order</p>
                          <p className="font-medium text-rust">Yes</p>
                        </div>
                      )}
                    </div>
                    
                    {additionalNotes && (
                      <div className="pt-3 border-t border-cream">
                        <p className="text-charcoal/50 text-sm">Notes</p>
                        <p className="text-sm text-ink">{additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white rounded-2xl border border-cream p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-sage rounded-lg flex items-center justify-center">
                      <HiCheck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="font-semibold text-ink">Ship To</h3>
                  </div>
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1.5 text-sm text-charcoal/60 hover:text-ink transition-colors cursor-pointer"
                  >
                    <HiPencil className="w-4 h-4" />
                    Change
                  </button>
                </div>
                <div className="pl-12">
                  <p className="font-medium text-ink">{shippingAddress?.street}</p>
                  <p className="text-charcoal/60 text-sm">
                    {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}
                  </p>
                  <p className="text-charcoal/60 text-sm">{shippingAddress?.country}</p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-4 sm:space-y-6">
                <PriceCalculator pricing={pricing} loading={pricingLoading} />
                
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-ink text-white rounded-xl font-semibold hover:bg-charcoal transition-all duration-300 hover:shadow-lg hover:shadow-ink/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <HiCreditCard className="w-5 h-5" />
                        <span>Pay & Place Order</span>
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setStep(0)}
                    className="w-full px-6 py-3 text-charcoal/70 hover:text-ink transition-colors text-sm cursor-pointer"
                  >
                    Back to Customization
                  </button>
                </div>

                {/* Secure Payment Badge */}
                <div className="p-4 bg-sage/5 rounded-xl border border-sage/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <HiShieldCheck className="w-5 h-5 text-sage" />
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm">Secure Payment</p>
                      <p className="text-xs text-charcoal/50">Protected by Stripe</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}