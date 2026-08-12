import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-700 bg-gray-800 text-gray-400 mt-auto">
      <div className="mx-auto max-w-5xl px-8 py-6 text-sm text-center">
        <p>© 2026 <Link href='https://i.pinimg.com/736x/2c/50/ac/2c50ac3c9d4b8593f14117effad8dc05.jpg' target="_blank"
 rel="noopener noreferrer" className='text-pink-400 hover:underline hover:bg-lime-400'>retake</Link> · A student ProtonDB-inspired project</p>
        <p className="mt-1 text-gray-500">
          Built by <Link href='https://i.pinimg.com/1200x/44/47/1b/44471beb1e31bf642b5028dc49a2a7ab.jpg' target="_blank"
 rel="noopener noreferrer" className='text-pink-400 hover:underline hover:bg-lime-400'>annie</Link>, <Link href='https://i.pinimg.com/736x/f3/c2/cf/f3c2cf2465764b860ad27c2a8b808fe6.jpg' target="_blank"
 rel="noopener noreferrer" className='text-blue-700 hover:underline hover:bg-pink-600'>sundae</Link> &amp; <Link href='https://i.pinimg.com/736x/05/27/45/0527453770e2cb75ca4e2e54ac6de260.jpg' target="_blank"
 rel="noopener noreferrer" className='text-red-700 hover:underline hover:bg-blue-600'>enis</Link> · Not affiliated with <Link href='https://i.pinimg.com/736x/9c/1f/2b/9c1f2bbc4df3f281e30cafeb733b5ad0.jpg' target="_blank"
 rel="noopener noreferrer" className='hover:underline'>Valve</Link> or <Link href='https://i.pinimg.com/736x/63/23/18/6323183308202f1425ea290b8b7e8504.jpg' target="_blank"
 rel="noopener noreferrer" className='hover:underline'>Steam</Link>
        </p>
      </div>
    </footer>
  );
}