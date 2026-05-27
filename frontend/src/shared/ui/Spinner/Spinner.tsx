interface Props {
  fullscreen?: boolean;
}

export const Spinner = ({ fullscreen }: Props) => {
  if (fullscreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent
          rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent
        rounded-full animate-spin" />
    </div>
  );
};