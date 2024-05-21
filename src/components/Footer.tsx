import '../styles/components/Footer.scss';

export default function Footer() {
  const today = new Date();

  return (
    <footer>
      &copy; {today.getFullYear()} Michael Solati. All rights reserved.
    </footer>
  );
}
