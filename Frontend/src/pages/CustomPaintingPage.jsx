import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import CouponInput from '../components/cart/CouponInput';
import Breadcrumb from '../components/common/Breadcrumb';

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
  const [step, setStep] = useState(0); // 0: customize, 1: address, 2: review

  useEffect(() => {
    dispatch(fetchCustomOrderOptions());
  }, [dispatch]);

  // Auto calculate price
  const debouncedSize = useDebounce(canvasSize, 300);
  const debouncedStyle = useDebounce(sketchStyle, 300);
  const debouncedFrame = useDebounce(framingOption, 300);

  useEffect(() => {
    dispatch(calculateCustomPrice({ canvasSize, customSize, sketchStyle, framingOption, numberOfSubjects, isRushOrder }));
  }, [dispatch, debouncedSize, debouncedStyle, debouncedFrame, numberOfSubjects, isRushOrder]);

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

  return (
    <div>
      <Breadcrumb items={[{ label: 'Custom Painting' }]} />
      <h1>Custom Painting Order</h1>
      <p>Transform your photos into stunning artwork</p>

      {step === 0 && (
        <div>
          <div>
            <div>
              {/* Step 1: Upload */}
              <section>
                <h2>1. Upload Your Photo</h2>
                <ImageUploader value={referenceImage} onChange={setReferenceImage} />
                {referenceImage && (
                  <AiStyleSuggester
                    imageUrl={referenceImage.url}
                    onSelectStyle={setSketchStyle}
                    onSuggestionsReceived={setAiSuggestions}
                  />
                )}
              </section>

              {/* Step 2: Style */}
              <section>
                <h2>2. Choose Your Style</h2>
                <StyleSelector value={sketchStyle} onChange={setSketchStyle} aiSuggestions={aiSuggestions} />
              </section>

              {/* Step 3: Size */}
              <section>
                <h2>3. Select Canvas Size</h2>
                <SizeSelector value={canvasSize} onChange={setCanvasSize} customSize={customSize} onCustomSizeChange={setCustomSize} />
              </section>

              {/* Step 4: Frame */}
              <section>
                <h2>4. Framing Option</h2>
                <FrameSelector value={framingOption} onChange={setFramingOption} />
              </section>

              {/* Step 5: Options */}
              <section>
                <h2>5. Additional Options</h2>
                <OptionsSelector
                  colorStyle={colorStyle} onColorChange={setColorStyle}
                  background={backgroundPreference} onBackgroundChange={setBackgroundPreference}
                  subjects={numberOfSubjects} onSubjectsChange={setNumberOfSubjects}
                  isRush={isRushOrder} onRushChange={setIsRushOrder}
                  notes={additionalNotes} onNotesChange={setAdditionalNotes}
                />
              </section>
            </div>

            {/* Price Sidebar */}
            <div>
              <PriceCalculator pricing={pricing} loading={pricingLoading} />
              <button onClick={() => setStep(1)} disabled={!referenceImage}>
                Continue to Shipping
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div>
          <h2>Shipping Address</h2>
          {user?.addresses?.length > 0 && (
            <div>
              {user.addresses.map((addr) => (
                <button key={addr._id} onClick={() => { setShippingAddress(addr); setStep(2); }}>
                  <p>{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
                </button>
              ))}
            </div>
          )}
          <AddressForm address={shippingAddress} onSubmit={(addr) => { setShippingAddress(addr); setStep(2); }} onCancel={() => setStep(0)} />
        </div>
      )}

      {step === 2 && (
        <div>
          <h2>Review Your Order</h2>
          <div>
            <img src={referenceImage?.url} alt="Reference" />
            <div>
              <p>Style: {sketchStyle}</p>
              <p>Size: {canvasSize}</p>
              <p>Color: {colorStyle}</p>
              <p>Frame: {framingOption}</p>
              <p>Subjects: {numberOfSubjects}</p>
              {additionalNotes && <p>Notes: {additionalNotes}</p>}
            </div>
          </div>
          <div>
            <p>Ship to: {shippingAddress?.street}, {shippingAddress?.city}</p>
            <button onClick={() => setStep(1)}>Change</button>
          </div>
          <PriceCalculator pricing={pricing} loading={pricingLoading} />
          <div>
            <button onClick={() => setStep(0)}>Back</button>
            <button onClick={handleSubmit} disabled={loading}>{loading ? 'Processing...' : 'Pay & Place Order'}</button>
          </div>
        </div>
      )}
    </div>
  );
}