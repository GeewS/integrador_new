import React from 'react';
import MapaSenai from '../../componentes/mapa/mapa';
import Header from '../../componentes/header/header';
import Footer from '../../componentes/footer/footer';
import styles from './mapeamento.module.css';

export default function Mapeamento() {
  return (
    <>
        <Header/>
        <div className={styles.container}>
            <h1 className={styles.titulo}>Mapeamento</h1>
            <div className={styles.mapaBox}>
                <MapaSenai />
            </div>
        </div>
        <Footer/>
    </>
  );
}
