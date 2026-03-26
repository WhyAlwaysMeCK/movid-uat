function SkeletonCard() {
  return (
    <div className="glass-panel animate-pulse p-5">
      <div className="h-4 w-24 rounded-full bg-sage-100 dark:bg-white/10" />
      <div className="mt-4 h-8 w-3/4 rounded-2xl bg-sage-100 dark:bg-white/10" />
      <div className="mt-3 h-4 w-full rounded-full bg-sage-100 dark:bg-white/10" />
      <div className="mt-2 h-4 w-5/6 rounded-full bg-sage-100 dark:bg-white/10" />
      <div className="mt-6 flex gap-3">
        <div className="h-10 w-24 rounded-full bg-sage-100 dark:bg-white/10" />
        <div className="h-10 w-24 rounded-full bg-sage-100 dark:bg-white/10" />
      </div>
    </div>
  );
}

export default SkeletonCard;
