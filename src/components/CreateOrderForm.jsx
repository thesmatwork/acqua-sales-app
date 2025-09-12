import React, { useEffect, useState } from 'react';
import axios from 'axios';

const formatOdooDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const CreateOrderForm = ({ onClose, onSubmit, reloadData }) => {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]); // start empty
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customerLoading, setCustomerLoading] = useState(true);
  const [productLoading, setProductLoading] = useState(true);

  // Retry-safe fetch for customers
  const fetchCustomersUntilReady = () => {
    setCustomerLoading(true);

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          'https://d28c5r6pnnqv4m.cloudfront.net/fastapi/odoo/contacts/external-contacts'
        );
        const data = res.data;

        if (Array.isArray(data) && data.length > 0) {
          setCustomers(data);
          setCustomerLoading(false);
          clearInterval(interval);
        } else if (data?.detail === 'Request-sent') {
          console.log('Customers not ready yet, retrying...');
        } else {
          console.warn('Unexpected response:', data);
          setCustomers([]);
          setCustomerLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching customers:', err.message || err);
      }
    }, 2000);
  };

  // Retry-safe fetch for products
  const fetchProductsUntilReady = () => {
    setProductLoading(true);

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(
          'https://d28c5r6pnnqv4m.cloudfront.net/fastapi/odoo/products',
          { params: { skip: 0, limit: 10 } }
        );
        const data = res.data;

        if (Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
          setProductLoading(false);
          clearInterval(interval);
        } else if (data?.detail === 'Request-sent') {
          console.log('Products not ready yet, retrying...');
        } else {
          console.warn('Unexpected response:', data);
          setProducts([]);
          setProductLoading(false);
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Error fetching products:', err.message || err);
      }
    }, 2000);
  };

  useEffect(() => {
    fetchCustomersUntilReady();
    fetchProductsUntilReady();
  }, [reloadData]);

  const addProduct = (product) => {
    const existing = orderItems.find((item) => item.id === product.id);
    if (existing) {
      setOrderItems(
        orderItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setOrderItems([...orderItems, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setOrderItems(orderItems.filter((item) => item.id !== id));
    } else {
      setOrderItems(
        orderItems.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const total = orderItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * item.quantity,
    0
  );

  const handleSubmit = async () => {
    if (!selectedCustomer || orderItems.length === 0) {
      alert('Please select a customer and add at least one product.');
      return;
    }

    const customer = customers.find((c) => c.name === selectedCustomer);
    if (!customer) {
      alert('Selected customer not found.');
      return;
    }

    const order_line = orderItems.map((item) => ({
      product_id: item.id,
      product_uom_qty: item.quantity,
    }));

    const date_order = formatOdooDate(new Date());

    try {
      setLoading(true);
      const response = await axios.post(
        'https://d28c5r6pnnqv4m.cloudfront.net/fastapi/odoo/orders',
        { partner_id: customer.id, date_order, order_line },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert('Order created successfully!');
      onSubmit({ customer: selectedCustomer, items: orderItems, total, apiResponse: response.data });
      onClose();
    } catch (err) {
      console.error('Error creating order:', err.response || err.message);
      alert('Failed to create order.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Customers */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Customer</label>
        {customerLoading ? (
          <p>Loading customers...</p>
        ) : (
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Choose a customer...</option>
            {customers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} - {c.phone || 'No phone'}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Products */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Add Products</label>
        {productLoading ? (
          <p>Loading products...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.map((p) => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium text-gray-800">{p.name}</h4>
                    <p className="text-sm text-gray-600">₹{p.price}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addProduct(p)}
                    className="bg-orange-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-orange-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No products available</p>
        )}
      </div>

      {/* Order Items */}
      {orderItems.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
          <div className="space-y-2">
            {orderItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium">{item.name}</span>
                  <span className="text-gray-600 ml-2">₹{item.price}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="bg-red-500 text-white w-6 h-6 rounded text-sm hover:bg-red-600"
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="bg-green-500 text-white w-6 h-6 rounded text-sm hover:bg-green-600"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-right mt-4">
            <span className="text-lg font-bold text-gray-800">Total: ₹{total.toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Create Order'}
        </button>
      </div>
    </div>
  );
};

export default CreateOrderForm;
