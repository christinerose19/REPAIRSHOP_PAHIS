import { useState } from 'react';
import { Plus, Trash2, Printer, X, Package, Wrench } from 'lucide-react';
import { toast } from 'sonner';

interface POSItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const AVAILABLE_ITEMS = [
  { name: 'Engine Oil 10W-40', price: 200, category: 'Oil & Lubricants', isService: false },
  { name: 'Brake Pads (Front)', price: 95, category: 'Brake Parts', isService: false },
  { name: 'Chain Lubricant', price: 150, category: 'Oil & Lubricants', isService: false },
  { name: 'Air Filter', price: 60, category: 'Engine Parts', isService: false },
  { name: 'Spark Plugs (Set of 4)', price: 30, category: 'Engine Parts', isService: false },
  { name: 'Motorcycle Tire (Front)', price: 120, category: 'Tires', isService: false },
  { name: 'Motorcycle Tire (Rear)', price: 140, category: 'Tires', isService: false },
  { name: 'Battery 12V', price: 85, category: 'Electrical Parts', isService: false },
  { name: 'Engine Tune-up (Service)', price: 150, category: 'Service', isService: true },
  { name: 'Oil Change Service', price: 50, category: 'Service', isService: true },
  { name: 'Brake Bleeding (Service)', price: 80, category: 'Service', isService: true },
  { name: 'Chain Adjustment & Cleaning', price: 40, category: 'Service', isService: true },
  { name: 'Electrical Troubleshooting (Service)', price: 120, category: 'Service', isService: true },
];

export function POS() {
  const [customerId, setCustomerId] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [repairJobId, setRepairJobId] = useState('');
  const [motorcycleModel, setMotorcycleModel] = useState('');
  const [items, setItems] = useState<POSItem[]>([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState<any>(null);
  const [isSuggestionsVisible, setIsSuggestionsVisible] = useState(false);

  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    quantity: 1,
  });

  const filteredItems = AVAILABLE_ITEMS.filter((item) =>
    item.name.toLowerCase().includes(newItem.name.toLowerCase())
  );

  const addItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error('Please enter item name and price');
      return;
    }

    const item: POSItem = {
      id: `ITEM-${Date.now()}`,
      name: newItem.name,
      price: parseFloat(newItem.price),
      quantity: newItem.quantity,
    };

    setItems([...items, item]);
    setNewItem({ name: '', price: '', quantity: 1 });
    toast.success('Item added to cart');
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast.success('Item removed');
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handlePayment = () => {
    if (!customerId || !customerName || items.length === 0) {
      toast.error('Please fill in customer details and add at least one item');
      return;
    }

    const receipt = {
      receiptId: `REC-${Date.now()}`,
      customerId,
      customerName,
      repairJobId: repairJobId || 'N/A',
      motorcycleModel: motorcycleModel || 'N/A',
      items,
      subtotal: calculateSubtotal(),
      tax: calculateTax(),
      total: calculateTotal(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };

    setReceiptData(receipt);
    setShowReceipt(true);
    toast.success('Payment processed successfully!');
  };

  const resetPOS = () => {
    setCustomerId('');
    setCustomerName('');
    setRepairJobId('');
    setMotorcycleModel('');
    setItems([]);
    setNewItem({ name: '', price: '', quantity: 1 });
  };

  const handlePrintReceipt = () => {
    window.print();
    toast.success('Receipt sent to printer');
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
        <p className="text-gray-600 mt-1">Process payments for completed repairs</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Customer & Items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer ID</label>
                <input
                  type="text"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="C-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Repair Job ID</label>
                <input
                  type="text"
                  value={repairJobId}
                  onChange={(e) => setRepairJobId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="R-1045"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Motorcycle Model</label>
                <input
                  type="text"
                  value={motorcycleModel}
                  onChange={(e) => setMotorcycleModel(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Honda CBR 600"
                />
              </div>
            </div>
          </div>

          {/* Add Items */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Add Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">Item / Service</label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => {
                    setNewItem({ ...newItem, name: e.target.value });
                    setIsSuggestionsVisible(true);
                  }}
                  onFocus={() => setIsSuggestionsVisible(true)}
                  onBlur={() => {
                    // Delay hiding the suggestions list so that clicks can register
                    setTimeout(() => setIsSuggestionsVisible(false), 200);
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="Engine Oil Change"
                />
                {isSuggestionsVisible && (
                  <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto z-50 divide-y divide-gray-100">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <div
                          key={item.name}
                          onMouseDown={() => {
                            setNewItem({
                              name: item.name,
                              price: item.price.toString(),
                              quantity: newItem.quantity,
                            });
                            setIsSuggestionsVisible(false);
                          }}
                          className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center transition-colors duration-150"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`p-1.5 rounded-lg flex-shrink-0 ${item.isService ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'}`}>
                              {item.isService ? <Wrench className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                            </div>
                            <div className="truncate">
                              <span className="font-semibold text-gray-800 block text-sm truncate">{item.name}</span>
                              <span className="text-[10px] text-gray-400 uppercase font-semibold font-mono tracking-wider">{item.category}</span>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-[#1e3a8a] ml-2">₱{item.price.toFixed(2)}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-4 text-sm text-gray-500 text-center">
                        No matching items found
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={newItem.price}
                  onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  placeholder="50"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Qty</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e3a8a] focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            <button
              onClick={addItem}
              className="mt-4 flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Item
            </button>
          </div>

          {/* Items List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Items List</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 text-gray-900">{item.name}</td>
                      <td className="px-6 py-4 text-gray-700">₱{item.price.toFixed(2)}</td>
                      <td className="px-6 py-4 text-gray-700">{item.quantity}</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">₱{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {items.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No items added yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Payment Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-medium">₱{calculateSubtotal().toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-700">
                <span>Tax (8%):</span>
                <span className="font-medium">₱{calculateTax().toFixed(2)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4 flex justify-between">
                <span className="text-lg font-bold text-gray-900">Total:</span>
                <span className="text-lg font-bold text-[#1e3a8a]">₱{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handlePayment}
              className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium mb-3"
            >
              Process Payment
            </button>

            <button
              onClick={resetPOS}
              className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between print:hidden">
              <h2 className="text-2xl font-bold text-gray-900">Receipt</h2>
              <button
                onClick={() => setShowReceipt(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Receipt Content */}
            <div className="p-8" id="receipt-content">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">MacMAc Shop</h1>
                <p className="text-gray-600">Professional Motorcycle Repair</p>
                <p className="text-sm text-gray-500 mt-2">Zone 2, San Isidro, Balingasag, Misamis Oriental</p>
                <p className="text-sm text-gray-500">Phone: 09489647334</p>
              </div>

              <div className="border-t border-b border-gray-300 py-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Receipt ID:</p>
                    <p className="font-medium text-gray-900">{receiptData.receiptId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Date:</p>
                    <p className="font-medium text-gray-900">{receiptData.date} {receiptData.time}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer ID:</p>
                    <p className="font-medium text-gray-900">{receiptData.customerId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Customer Name:</p>
                    <p className="font-medium text-gray-900">{receiptData.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Repair Job:</p>
                    <p className="font-medium text-gray-900">{receiptData.repairJobId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Motorcycle:</p>
                    <p className="font-medium text-gray-900">{receiptData.motorcycleModel}</p>
                  </div>
                </div>
              </div>

              <table className="w-full mb-6">
                <thead className="border-b-2 border-gray-300">
                  <tr>
                    <th className="text-left py-2 text-gray-700">Item</th>
                    <th className="text-right py-2 text-gray-700">Price</th>
                    <th className="text-right py-2 text-gray-700">Qty</th>
                    <th className="text-right py-2 text-gray-700">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {receiptData.items.map((item: POSItem) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="py-3 text-gray-900">{item.name}</td>
                      <td className="text-right text-gray-700">₱{item.price.toFixed(2)}</td>
                      <td className="text-right text-gray-700">{item.quantity}</td>
                      <td className="text-right text-gray-900 font-medium">₱{(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="border-t-2 border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal:</span>
                  <span className="font-medium">₱{receiptData.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (8%):</span>
                  <span className="font-medium">₱{receiptData.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                  <span>Total:</span>
                  <span>₱{receiptData.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-sm text-gray-600">
                <p>Thank you for your business!</p>
                <p className="mt-2">Please come again</p>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3 justify-end print:hidden">
              <button
                onClick={() => setShowReceipt(false)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handlePrintReceipt}
                className="flex items-center gap-2 px-6 py-3 bg-[#1e3a8a] text-white rounded-lg hover:bg-[#1e40af] transition-colors"
              >
                <Printer className="w-5 h-5" />
                Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
