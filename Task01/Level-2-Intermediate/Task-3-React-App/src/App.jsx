
import { useState } from 'react'
import './App.css'

import logo from './assets/images/profile.jpg'
import springRoll from './assets/images/spring-roll.jpg'
import chilaBread from './assets/images/chila-bread.jpg'
import sambusa from './assets/images/sambusa.jpg'
import eggBread from './assets/images/egg-bread.jpg'
import zebraCake from './assets/images/zebra-cake.jpg'
import chocolateCake from './assets/images/chocolate-cake.jpg'
import chapati from './assets/images/chapati.jpg'
import chicken from './assets/images/chicken.png'
import fish from './assets/images/fish.png'
import servicesImage from './assets/images/restaurant services.png'

const menu = [
  { name: 'Spring Roll', category: 'Snacks', image: springRoll },
  { name: 'Chila Bread', category: 'Bakery', image: chilaBread },
  { name: 'Sambusa', category: 'Snacks', image: sambusa },
  { name: 'Egg Bread', category: 'Bakery', image: eggBread },
  { name: 'Zebra Cake', category: 'Cakes', image: zebraCake },
  { name: 'Chocolate Cake', category: 'Cakes', image: chocolateCake },
  { name: 'Chapati', category: 'Bakery', image: chapati },
  { name: 'Chicken', category: 'Meals', image: chicken },
  { name: 'Fish', category: 'Meals', image: fish },
]

function Navbar() {
  return (
    <nav className="navbar">
      <a className="brand" href="#home">
        <img src={logo} alt="Khalsa360 logo" />
        <span>Khalsa<span className="brand-accent">360</span></span>
      </a>

      <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#menu">Our Menu</a>
        <a href="#services">Services</a>
        <a href="#about">About Us</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  )
}

function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <img src={item.image} alt={item.name} />
      <div className="menu-info">
        <span>{item.category}</span>
        <h3>{item.name}</h3>
      </div>
    </article>
  )
}

function MenuSection() {
  const [category, setCategory] = useState('All')
  const categories = ['All', 'Snacks', 'Bakery', 'Cakes', 'Meals']
  const filteredMenu = category === 'All'
    ? menu
    : menu.filter(item => item.category === category)

  return (
    <section id="menu" className="section">
      <div className="section-heading">
        <p className="eyebrow">MADE WITH CARE</p>
        <h2>Something Delicious for Everyone</h2>
        <p>Discover your favourites, freshly prepared for you.</p>
      </div>

      <div className="filters">
        {categories.map(item => (
          <button
            key={item}
            className={category === item ? 'filter active' : 'filter'}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="menu-grid">
        {filteredMenu.map(item => (
          <MenuCard key={item.name} item={item} />
        ))}
      </div>
    </section>
  )
}

function App() {
  return (
    <>
      <Navbar />

      <main>
        <section id="home" className="hero">
          <div className="hero-content">
            <p className="eyebrow">WELCOME TO KHALSA360</p>
            <h1>Good Food.<br /><span>Good Mood.</span></h1>
            <p>
              From delicious snacks to delightful cakes,
              there is something special waiting for you.
            </p>
            <a className="primary-button" href="#menu">Explore Our Menu</a>
          </div>
          <img className="hero-image" src={chocolateCake} alt="Chocolate cake" />
        </section>

        <MenuSection />

        <section id="services" className="services section">
          <img src={servicesImage} alt="Khalsa360 restaurant services" />
          <div>
            <p className="eyebrow">HERE FOR YOU</p>
            <h2>Good Food, Thoughtful Service</h2>
            <p>
              Enjoy tasty snacks, freshly baked treats, cakes for
              special moments, and satisfying meals made with care.
            </p>
            <a className="text-link" href="#contact">Get in touch →</a>
          </div>
        </section>

        <section id="about" className="about section">
          <p className="eyebrow">OUR STORY</p>
          <h2>A Little Joy in Every Bite</h2>
          <p>
            At Khalsa360 Restaurant, we believe good food brings
            people together. Our goal is to make every visit feel
            welcoming, enjoyable, and memorable.
          </p>
        </section>

        <section id="contact" className="contact section">
          <p className="eyebrow">LET'S CONNECT</p>
          <h2>We Would Love to Hear from You</h2>
          <p>Have a question or planning a special order? Contact us.</p>
          <div className="contact-links">
            <a href="mailto:khadija09said09@gmail.com">Email Us</a>
            <a
              href="https://wa.me/0675788310"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>
      
        </section>
      </main>

      <footer>
        <a className="footer-brand" href="#home">Khalsa360 Restaurant</a>
        <p>Good food, warm moments, happy memories.</p>
        <p>© {new Date().getFullYear()} Khalsa360 Restaurant</p>
      </footer>
    </>
  )
}

export default App
