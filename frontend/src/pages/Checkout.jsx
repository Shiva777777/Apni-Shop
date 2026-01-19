
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Checkout = () => {
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // New Address Form
    const [formData, setFormData] = useState({
        full_name: '',
        phone: '',
        address_line1: '',
        city: '',
        state: '',
        pincode: '',
        address_type: 'HOME'
    });

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const response = await api.get('/orders/addresses/');
            const addressList = response.data.results || response.data;
            setAddresses(addressList);
            if (addressList.length > 0) {
                setSelectedAddress(addressList[0].id);
            } else {
                setShowNewAddress(true);
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching addresses:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePlaceOrder = async () => {
        setSubmitting(true);
        try {
            let addressId = selectedAddress;

            if (showNewAddress || !addressId) {
                const addressParams = { ...formData, address_line2: '', country: 'India' };
                const addrResponse = await api.post('/orders/addresses/', addressParams);
                addressId = addrResponse.data.id;
            }

            const orderParams = { shipping_address_id: addressId, payment_method: 'COD', customer_notes: '' };
            await api.post('/orders/orders/', orderParams);
            toast.success('Your order has been placed successfully ✨');
            navigate('/orders');
        } catch (error) {
            console.error('Error placing order:', error);
            toast.error('Failed to place order');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
            <Navbar />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <div style={{ color: 'var(--primary)', fontWeight: '600' }}>Preparing checkout...</div>
            </div>
        </div>
    );

    return (
        <div style={{ backgroundColor: 'var(--background)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '80px' }}>
            <Navbar />
            <div className="container" style={{ maxWidth: '800px' }}>
                <div style={{ marginBottom: '40px' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Checkout</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Secure payment and fast delivery</p>
                </div>

                <div className="card animate-fade-in" style={{ padding: '2.5rem' }}>
                    {/* Address Selection */}
                    <div style={{ marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Shipping Address</h2>
                            {!showNewAddress && addresses.length > 0 && (
                                <button
                                    onClick={() => { setShowNewAddress(true); setSelectedAddress(null); }}
                                    style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '14px', background: 'none' }}
                                >
                                    + Add New
                                </button>
                            )}
                        </div>

                        {!showNewAddress && addresses.length > 0 ? (
                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {addresses.map(addr => (
                                    <div
                                        key={addr.id}
                                        onClick={() => setSelectedAddress(addr.id)}
                                        className="card"
                                        style={{
                                            padding: '1.25rem',
                                            cursor: 'pointer',
                                            transition: 'var(--transition)',
                                            borderColor: selectedAddress === addr.id ? 'var(--primary)' : 'var(--border)',
                                            borderWidth: selectedAddress === addr.id ? '2px' : '1px',
                                            backgroundColor: selectedAddress === addr.id ? 'var(--primary-light)' : 'white'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '800', fontSize: '15px' }}>{addr.full_name}</span>
                                            <span style={{
                                                fontSize: '10px',
                                                textTransform: 'uppercase',
                                                fontWeight: '800',
                                                backgroundColor: 'white',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid var(--border)'
                                            }}>{addr.address_type}</span>
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.5' }}>
                                            {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                                        </div>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>
                                            📱 {addr.phone}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="animate-fade-in">
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Full Name</label>
                                        <input type="text" name="full_name" placeholder="John Doe" value={formData.full_name} onChange={handleInputChange} style={inputStyles} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Phone Number</label>
                                        <input type="text" name="phone" placeholder="+91 00000 00000" value={formData.phone} onChange={handleInputChange} style={inputStyles} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Street Address</label>
                                    <input type="text" name="address_line1" placeholder="Building, Street, Area" value={formData.address_line1} onChange={handleInputChange} style={inputStyles} required />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>City</label>
                                        <input type="text" name="city" placeholder="e.g. Mumbai" value={formData.city} onChange={handleInputChange} style={inputStyles} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>State</label>
                                        <input type="text" name="state" placeholder="e.g. Maharashtra" value={formData.state} onChange={handleInputChange} style={inputStyles} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label>Pincode</label>
                                        <input type="text" name="pincode" placeholder="000000" value={formData.pincode} onChange={handleInputChange} style={inputStyles} required />
                                    </div>
                                </div>
                                {addresses.length > 0 && (
                                    <button
                                        onClick={() => setShowNewAddress(false)}
                                        style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '600', background: 'none' }}
                                    >
                                        ← Back to saved addresses
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Payment Method */}
                    <div style={{ marginBottom: '3rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Payment Method</h2>
                        <div className="card" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1.25rem',
                            borderColor: 'var(--primary)',
                            backgroundColor: 'var(--primary-light)',
                            borderWidth: '2px'
                        }}>
                            <div style={{ fontSize: '24px' }}>💵</div>
                            <div>
                                <div style={{ fontWeight: '800', color: 'var(--primary)' }}>Cash on Delivery</div>
                                <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Pay when your package arrives at your doorstep</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handlePlaceOrder}
                        disabled={submitting || (!selectedAddress && !showNewAddress)}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1.25rem', fontSize: '18px', borderRadius: '12px' }}
                    >
                        {api.loading ? '...' : (submitting ? 'Authenticating Order...' : 'Confirm Order')}
                    </button>
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', marginTop: '1.5rem' }}>
                        By placing this order, you agree to our Terms of Service.
                    </p>
                </div>
            </div>
        </div>
    );
};

const inputStyles = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    fontSize: '14px',
    backgroundColor: '#fcfcfd'
};

export default Checkout;
