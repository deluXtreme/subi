'use client'

import dynamic from 'next/dynamic';

const SubscribeButton = dynamic(() => import("./subscribe-button").then(mod => ({ default: mod.SubscribeButton })), {
  ssr: false,
  loading: () => (
    <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-8 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
});

interface DynamicSubscribeButtonProps {
  className?: string;
}

export function DynamicSubscribeButton({ className }: DynamicSubscribeButtonProps) {
  return <SubscribeButton className={className} />;
}