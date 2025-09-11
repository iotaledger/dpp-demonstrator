import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/introduction/1');
}
