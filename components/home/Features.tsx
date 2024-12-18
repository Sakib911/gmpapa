import { Zap, Shield, Clock, CreditCard, Gamepad2, HeadphonesIcon } from 'lucide-react';

const features = [
  {
    name: 'Instant Delivery',
    description: 'Get your gaming products delivered instantly after payment confirmation',
    icon: Zap,
    gradient: 'from-yellow-600 to-red-600'
  },
  {
    name: 'Secure Transactions',
    description: 'Your purchases are protected with bank-grade security measures',
    icon: Shield,
    gradient: 'from-green-600 to-emerald-600'
  },
  {
    name: '24/7 Support',
    description: 'Our dedicated gaming support team is always here to help you',
    icon: HeadphonesIcon,
    gradient: 'from-blue-600 to-cyan-600'
  },
  {
    name: 'Multiple Payment Methods',
    description: 'Choose from various secure payment options for your convenience',
    icon: CreditCard,
    gradient: 'from-purple-600 to-pink-600'
  },
  {
    name: 'Wide Game Selection',
    description: 'Access top-ups and cards for all your favorite games',
    icon: Gamepad2,
    gradient: 'from-red-600 to-orange-600'
  },
  {
    name: 'Fast Processing',
    description: 'Quick and efficient order processing for seamless gaming',
    icon: Clock,
    gradient: 'from-indigo-600 to-purple-600'
  }
];

export function Features() {
  return (
    <div className="py-24 bg-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">Why Choose Us</h2>
          <p className="mt-4 text-lg text-gray-400">
            Experience the best in gaming top-ups and gift cards
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.name}
              className="relative group"
            >
              {/* Animated border gradient */}
              <div className="absolute -inset-0.5 bg-gradient-to-r opacity-75 group-hover:opacity-100 transition duration-300 blur-sm" />
              
              <div className="relative bg-black rounded-2xl p-8 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 inline-flex p-4 rounded-xl bg-gradient-to-r ${feature.gradient} bg-opacity-10`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {feature.name}
                    </h3>
                    <p className="mt-2 text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}