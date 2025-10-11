export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white"></div>
    </div>
  );
} 

// todo 联系方式，做成可以配置的啊啊啊；同时应该可以支持选择自定义email或者图标。