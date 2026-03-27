// CustomPaintingPage.jsx
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
import { 
  HiPhotograph, HiSparkles, HiCube, HiViewBoards, HiAdjustments, 
  HiLocationMarker, HiEye, HiArrowLeft, HiArrowRight, HiShieldCheck, 
  HiCreditCard, HiCheck, HiPencil, HiClock, HiStar, HiHeart,
  HiLightningBolt, HiGift
} from 'react-icons/hi';
import orderApi from '../api/orderApi';

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

      if (res.razorpayOrder) {
        const options = {
          key: res.keyId,
          amount: res.razorpayOrder.amount,
          currency: res.razorpayOrder.currency,
          name: 'SketchMint',
          description: `Custom ${sketchStyle.replace(/-/g, ' ')} - ${canvasSize}`,
          order_id: res.razorpayOrder.id,
          handler: async function (response) {
            try {
              const verifyRes = await orderApi.verifyCustomPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: res.order._id,
              });
              if (verifyRes.success) {
                toast.success('Payment successful!');
                navigate(`/order-success?orderId=${res.order._id}&type=custom`);
              }
            } catch (err) {
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            contact: user.phone || '',
          },
          theme: { color: '#4f46e5' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      toast.error(err || 'Failed to create order');
    }
  };

  const steps = [
    { title: 'Customize', subtitle: 'Design your artwork', icon: HiSparkles },
    { title: 'Shipping', subtitle: 'Delivery address', icon: HiLocationMarker },
    { title: 'Review', subtitle: 'Confirm & pay', icon: HiEye },
  ];

  const getCompletionPercentage = () => {
    let completed = 0;
    if (referenceImage) completed += 20;
    if (sketchStyle) completed += 20;
    if (canvasSize) completed += 20;
    if (framingOption) completed += 20;
    if (step >= 1) completed += 10;
    if (shippingAddress) completed += 10;
    return Math.min(completed, 100);
  };

  return (
    <div className="min-h-screen bg-paper">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Breadcrumb items={[{ label: 'Custom Painting' }]} />
        </div>
      </div>

      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-white via-cream/30 to-paper border-b border-cream overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-rust"></div>
          <div className="absolute bottom-10 right-20 w-24 h-24 rounded-full bg-gold"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-sage"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rust/10 to-gold/10 rounded-full mb-6 border border-rust/20">
              <HiSparkles className="w-4 h-4 text-rust animate-pulse" />
              <span className="text-sm font-semibold text-rust">Custom Commission</span>
              <HiSparkles className="w-4 h-4 text-gold animate-pulse" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ink mb-4">
              Create Your <span className="text-gradient">Masterpiece</span>
            </h1>
            <p className="text-lg sm:text-xl text-charcoal/70 max-w-2xl mx-auto mb-8">
              Transform your cherished photos into stunning hand-crafted artwork
            </p>

            {/* Stats Row */}
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mb-10">
              {[
                { icon: HiStar, value: '4.9/5', label: 'Customer Rating' },
                { icon: HiHeart, value: '10K+', label: 'Happy Customers' },
                { icon: HiClock, value: '7-14', label: 'Days Delivery' },
              ].map((stat, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-cream">
                    <stat.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-ink">{stat.value}</p>
                    <p className="text-xs text-charcoal/50">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="max-w-3xl mx-auto">
            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rust via-gold to-sage rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                />
              </div>
              <p className="text-center text-sm text-charcoal/50 mt-2">
                Step {step + 1} of {steps.length} • {getCompletionPercentage()}% Complete
              </p>
            </div>

            {/* Step Buttons */}
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              {steps.map((s, i) => (
                <div key={i} className="flex items-center">
                  <button
                    onClick={() => i < step && setStep(i)}
                    disabled={i > step}
                    className={`group relative flex flex-col sm:flex-row items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-4 rounded-2xl transition-all duration-500 cursor-pointer ${
                      i === step
                        ? 'bg-ink text-white shadow-xl shadow-ink/20 scale-105'
                        : i < step
                        ? 'bg-sage/10 text-sage hover:bg-sage/20 hover:scale-102'
                        : 'bg-cream/50 text-charcoal/40 cursor-not-allowed'
                    }`}
                  >
                    {/* Completion Ring */}
                    <div className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                      i === step ? 'bg-white/20' : i < step ? 'bg-sage/20' : 'bg-cream'
                    }`}>
                      {i < step ? (
                        <HiCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                      ) : (
                        <s.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      )}
                      
                      {/* Pulse Animation for Current Step */}
                      {i === step && (
                        <span className="absolute inset-0 rounded-xl bg-white/30 animate-ping" />
                      )}
                    </div>
                    
                    <div className="text-center sm:text-left">
                      <span className="block text-sm sm:text-base font-semibold">{s.title}</span>
                      <span className="hidden sm:block text-xs opacity-70">{s.subtitle}</span>
                    </div>
                  </button>
                  
                  {i < steps.length - 1 && (
                    <div className={`hidden sm:block w-12 lg:w-20 h-0.5 mx-3 transition-all duration-500 ${
                      i < step ? 'bg-gradient-to-r from-sage to-sage/50' : 'bg-cream'
                    }`}>
                      {i < step && (
                        <div className="w-full h-full bg-sage animate-shimmer" />
                      )}
                    </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Section 1: Upload */}
              <section className="group bg-white rounded-3xl border border-cream p-6 sm:p-8 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 animate-fade-in-up">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-rust to-rust/80 rounded-2xl flex items-center justify-center shadow-lg shadow-rust/20 group-hover:scale-110 transition-transform duration-500">
                      <HiPhotograph className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-ink text-white text-xs font-bold rounded-full flex items-center justify-center">1</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">Upload Your Photo</h2>
                    <p className="text-sm text-charcoal/60">High quality images create the best results</p>
                  </div>
                </div>
                
                <ImageUploader value={referenceImage} onChange={setReferenceImage} />
                
                {/* AI Suggestions */}
                {referenceImage && (
                  <div className="mt-8 pt-6 border-t border-cream animate-fade-in-up">
                    <AiStyleSuggester
                      imageUrl={referenceImage.url}
                      onSelectStyle={setSketchStyle}
                      onSuggestionsReceived={setAiSuggestions}
                    />
                  </div>
                )}
                
                {/* Upload Tips */}
                {!referenceImage && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { icon: '📷', tip: 'Use well-lit photos' },
                      { icon: '🎯', tip: 'Face clearly visible' },
                      { icon: '✨', tip: 'High resolution preferred' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-cream/50 rounded-xl">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm text-charcoal/70">{item.tip}</span>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 2: Style */}
              <section className="group bg-white rounded-3xl border border-cream p-6 sm:p-8 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 animate-fade-in-up stagger-1">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20 group-hover:scale-110 transition-transform duration-500">
                      <HiSparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-ink text-white text-xs font-bold rounded-full flex items-center justify-center">2</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">Choose Art Style</h2>
                    <p className="text-sm text-charcoal/60">Select the perfect artistic interpretation</p>
                  </div>
                </div>
                
                <StyleSelector value={sketchStyle} onChange={setSketchStyle} aiSuggestions={aiSuggestions} />
              </section>

              {/* Section 3: Size */}
              <section className="group bg-white rounded-3xl border border-cream p-6 sm:p-8 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 animate-fade-in-up stagger-2">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-sage to-sage/80 rounded-2xl flex items-center justify-center shadow-lg shadow-sage/20 group-hover:scale-110 transition-transform duration-500">
                      <HiCube className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-ink text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">Select Canvas Size</h2>
                    <p className="text-sm text-charcoal/60">Choose dimensions that fit your space</p>
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
              <section className="group bg-white rounded-3xl border border-cream p-6 sm:p-8 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 animate-fade-in-up stagger-3">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-charcoal to-charcoal/80 rounded-2xl flex items-center justify-center shadow-lg shadow-charcoal/20 group-hover:scale-110 transition-transform duration-500">
                      <HiViewBoards className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-ink text-white text-xs font-bold rounded-full flex items-center justify-center">4</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">Framing Option</h2>
                    <p className="text-sm text-charcoal/60">Complete your artwork with a beautiful frame</p>
                  </div>
                </div>
                
                <FrameSelector value={framingOption} onChange={setFramingOption} />
              </section>

              {/* Section 5: Additional Options */}
              <section className="group bg-white rounded-3xl border border-cream p-6 sm:p-8 hover:shadow-xl hover:shadow-ink/5 transition-all duration-500 animate-fade-in-up stagger-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-mist to-mist/80 rounded-2xl flex items-center justify-center shadow-lg shadow-mist/20 group-hover:scale-110 transition-transform duration-500">
                      <HiAdjustments className="w-6 h-6 sm:w-7 sm:h-7 text-charcoal" />
                    </div>
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-ink text-white text-xs font-bold rounded-full flex items-center justify-center">5</span>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-ink">Additional Options</h2>
                    <p className="text-sm text-charcoal/60">Fine-tune your custom order</p>
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

            {/* Right Sidebar - Sticky */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-5">
                {/* Price Calculator */}
                <div className="animate-fade-in-up">
                  <PriceCalculator pricing={pricing} loading={pricingLoading} />
                </div>
                
                {/* Continue Button */}
                <button 
                  onClick={() => setStep(1)} 
                  disabled={!referenceImage}
                  className="group w-full flex items-center justify-center gap-3 px-6 py-4 sm:py-5 bg-gradient-to-r from-ink to-charcoal text-white rounded-2xl font-semibold transition-all duration-500 hover:shadow-2xl hover:shadow-ink/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none active:scale-[0.98] animate-fade-in-up stagger-1"
                >
                  <span className="text-base sm:text-lg">Continue to Shipping</span>
                  <HiArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </button>

                {/* Trust Badges */}
                <div className="space-y-3 animate-fade-in-up stagger-2">
                  {[
                    { icon: HiShieldCheck, title: '100% Satisfaction', desc: 'Free revisions included', color: 'sage' },
                    { icon: HiGift, title: 'Premium Packaging', desc: 'Gift-ready presentation', color: 'gold' },
                    { icon: HiLightningBolt, title: 'Rush Available', desc: 'Express 3-5 day option', color: 'rust' },
                  ].map((badge, index) => (
                    <div 
                      key={index}
                      className={`group p-4 bg-white rounded-xl border border-cream hover:border-${badge.color}/30 hover:shadow-md transition-all duration-300 cursor-default`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 bg-${badge.color}/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <badge.icon className={`w-5 h-5 text-${badge.color}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-ink text-sm">{badge.title}</p>
                          <p className="text-xs text-charcoal/50">{badge.desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Help Card */}
                <div className="p-5 bg-gradient-to-br from-cream to-white rounded-2xl border border-cream animate-fade-in-up stagger-3">
                  <h4 className="font-semibold text-ink mb-2">Need Help?</h4>
                  <p className="text-sm text-charcoal/60 mb-4">Our artists are here to assist you with your custom order.</p>
                  <button className="w-full px-4 py-2.5 border-2 border-ink text-ink hover:bg-ink hover:text-white rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer">
                    Chat with Us
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Shipping */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto animate-fade-in-up">
            <div className="bg-white rounded-3xl border border-cream p-6 sm:p-8 lg:p-10 shadow-xl shadow-ink/5">
              {/* Back Button */}
              <button 
                onClick={() => setStep(0)}
                className="group flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors mb-8 cursor-pointer"
              >
                <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Customization</span>
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-sage to-sage/80 rounded-2xl flex items-center justify-center shadow-lg shadow-sage/20">
                  <HiLocationMarker className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink">Shipping Address</h2>
                  <p className="text-charcoal/60">Where should we deliver your masterpiece?</p>
                </div>
              </div>
              
              {/* Saved Addresses */}
              {user?.addresses?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold text-charcoal/70 mb-4 flex items-center gap-2">
                    <HiCheck className="w-4 h-4 text-sage" />
                    Saved Addresses
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {user.addresses.map((addr, index) => (
                      <button 
                        key={addr._id} 
                        onClick={() => { setShippingAddress(addr); setStep(2); }}
                        className={`group relative text-left p-5 rounded-2xl border-2 transition-all duration-500 cursor-pointer active:scale-[0.98] hover:shadow-lg animate-fade-in-up ${
                          shippingAddress?._id === addr._id 
                            ? 'border-sage bg-sage/5 shadow-lg shadow-sage/10' 
                            : 'border-cream hover:border-sage/50 bg-white'
                        }`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        {/* Selected Indicator */}
                        {shippingAddress?._id === addr._id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-sage rounded-full flex items-center justify-center">
                            <HiCheck className="w-4 h-4 text-white" />
                          </div>
                        )}
                        
                        {addr.isDefault && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-sage/10 text-sage text-xs font-semibold rounded-full mb-3">
                            <HiStar className="w-3 h-3" />
                            Default
                          </span>
                        )}
                        <p className="font-semibold text-ink">{addr.street}</p>
                        <p className="text-charcoal/60 text-sm mt-1">{addr.city}, {addr.state} {addr.zipCode}</p>
                        <p className="text-charcoal/40 text-sm">{addr.country}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-dashed border-cream" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-6 py-2 text-sm text-charcoal/50 font-medium">
                    Or add a new address
                  </span>
                </div>
              </div>
              
              {/* Address Form */}
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Back Button */}
              <button 
                onClick={() => setStep(1)}
                className="group flex items-center gap-2 text-charcoal/60 hover:text-ink transition-colors cursor-pointer animate-fade-in-up"
              >
                <HiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span>Back to Shipping</span>
              </button>

              {/* Header */}
              <div className="flex items-center gap-4 animate-fade-in-up">
                <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center shadow-lg shadow-gold/20">
                  <HiEye className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-ink">Review Your Order</h2>
                  <p className="text-charcoal/60">Everything looks perfect? Let's create your art!</p>
                </div>
              </div>

              {/* Order Details Card */}
              <div className="bg-white rounded-3xl border border-cream p-6 sm:p-8 shadow-xl shadow-ink/5 animate-fade-in-up stagger-1">
                <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                  {/* Image Preview */}
                  <div className="relative group w-full md:w-48 h-56 md:h-48 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={referenceImage?.url} 
                      alt="Reference" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Style Badge */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-sm font-semibold text-ink">
                        {STYLE_LABELS[sketchStyle]}
                      </span>
                    </div>
                  </div>
                  
                  {/* Details Grid */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-ink mb-4">Custom Artwork Details</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {[
                        { label: 'Style', value: STYLE_LABELS[sketchStyle], icon: HiSparkles },
                        { label: 'Size', value: canvasSize === 'custom' ? `${customSize.width}" × ${customSize.height}"` : canvasSize, icon: HiCube },
                        { label: 'Color', value: COLOR_LABELS[colorStyle], icon: HiAdjustments },
                        { label: 'Frame', value: FRAME_LABELS[framingOption], icon: HiViewBoards },
                        { label: 'Subjects', value: numberOfSubjects, icon: HiPhotograph },
                        ...(isRushOrder ? [{ label: 'Rush', value: 'Yes', icon: HiLightningBolt, highlight: true }] : []),
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className={`p-3 rounded-xl ${item.highlight ? 'bg-rust/10 border border-rust/20' : 'bg-cream/50'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <item.icon className={`w-4 h-4 ${item.highlight ? 'text-rust' : 'text-charcoal/40'}`} />
                            <p className="text-xs text-charcoal/50">{item.label}</p>
                          </div>
                          <p className={`font-semibold text-sm ${item.highlight ? 'text-rust' : 'text-ink'}`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    
                    {/* Notes */}
                    {additionalNotes && (
                      <div className="mt-4 pt-4 border-t border-cream">
                        <p className="text-xs text-charcoal/50 mb-1">Special Instructions</p>
                        <p className="text-sm text-ink bg-cream/50 p-3 rounded-xl">{additionalNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-white rounded-3xl border border-cream p-6 sm:p-8 shadow-xl shadow-ink/5 animate-fade-in-up stagger-2">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-sage rounded-xl flex items-center justify-center">
                      <HiCheck className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-ink">Delivery Address</h3>
                  </div>
                  <button 
                    onClick={() => setStep(1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-charcoal/60 hover:text-ink hover:bg-cream rounded-xl transition-all duration-300 cursor-pointer"
                  >
                    <HiPencil className="w-4 h-4" />
                    Change
                  </button>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-sage/5 rounded-xl border border-sage/20">
                  <div className="w-10 h-10 bg-sage/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiLocationMarker className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{shippingAddress?.street}</p>
                    <p className="text-charcoal/60 mt-1">
                      {shippingAddress?.city}, {shippingAddress?.state} {shippingAddress?.zipCode}
                    </p>
                    <p className="text-charcoal/50 text-sm">{shippingAddress?.country}</p>
                  </div>
                </div>
                
                {/* Delivery Estimate */}
                <div className="mt-4 flex items-center gap-3 p-3 bg-gold/5 rounded-xl border border-gold/20">
                  <HiClock className="w-5 h-5 text-gold" />
                  <p className="text-sm">
                    <span className="text-charcoal/60">Estimated Delivery: </span>
                    <span className="font-semibold text-ink">{isRushOrder ? '3-5 business days' : '7-14 business days'}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-5">
                {/* Price Calculator */}
                <div className="animate-fade-in-up">
                  <PriceCalculator pricing={pricing} loading={pricingLoading} />
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3 animate-fade-in-up stagger-1">
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-3 px-6 py-5 bg-gradient-to-r from-ink to-charcoal text-white rounded-2xl font-bold text-lg transition-all duration-500 hover:shadow-2xl hover:shadow-ink/30 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {loading ? (
                      <>
                        <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <HiCreditCard className="w-6 h-6" />
                        <span>Pay & Place Order</span>
                        <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={() => setStep(0)}
                    className="w-full px-6 py-3 text-charcoal/70 hover:text-ink hover:bg-cream rounded-xl transition-all duration-300 text-sm font-medium cursor-pointer"
                  >
                    ← Back to Customization
                  </button>
                </div>

                {/* Security Badges */}
                <div className="space-y-3 animate-fade-in-up stagger-2">
                  <div className="p-5 bg-gradient-to-br from-sage/5 to-sage/10 rounded-2xl border border-sage/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-sage/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <HiShieldCheck className="w-6 h-6 text-sage" />
                      </div>
                      <div>
                        <p className="font-bold text-ink">Secure Payment</p>
                        <p className="text-sm text-charcoal/60 mt-1">256-bit SSL encrypted transaction powered by Razorpay</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {['Visa', 'MC', 'UPI', 'Net Banking'].map((method, i) => (
                            <span 
                              key={i}
                              className="px-2 py-1 bg-white rounded text-xs font-medium text-charcoal/70 border border-cream"
                            >
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gold/5 rounded-xl border border-gold/20">
                    <div className="flex items-center gap-3">
                      <HiGift className="w-5 h-5 text-gold" />
                      <p className="text-sm">
                        <span className="font-semibold text-ink">Free Gift Wrapping</span>
                        <span className="text-charcoal/50"> included with your order</span>
                      </p>
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