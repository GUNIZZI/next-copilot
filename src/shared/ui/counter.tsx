import { Button } from '@/components/ui/button';
import { useCounterStore } from '@/shared/lib/store';

export function Counter() {
  const { count, increment, decrement, reset } = useCounterStore();

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border p-6">
      <h2 className="text-2xl font-bold">Counter</h2>
      <p className="text-5xl font-bold">{count}</p>
      <div className="flex gap-2">
        <Button onClick={decrement} variant="outline">
          Decrease
        </Button>
        <Button onClick={reset} variant="secondary">
          Reset
        </Button>
        <Button onClick={increment}>Increase</Button>
      </div>
    </div>
  );
}
