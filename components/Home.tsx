import React from "react";
import styled from "styled-components";
import { Button, BackTop, Typography, Carousel, Timeline, Image, Row, Col } from "antd";
import { useRouter } from "next/router";

const { Title } = Typography;

const StyledTitle = styled(Title)`
  margin-top: 2rem;
`;

const Home = () => {
  const router = useRouter();

  return (
    <>
      <BackTop />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Title level={1}>Secret des Anciens</Title>
        <img src="logo.png" style={{ width: "10rem", position: "absolute", right: 0, top: 0 }} />
      </div>

      <StyledTitle level={2} id="presentation">
        Présentation
      </StyledTitle>
      <p>
        Nous sommes une guilde installée depuis très longtemps sur les serveurs Vol'jin / Chants
        Eternels et qui a pour vocation de progresser ensemble et dans une bonne ambiance dans le
        contenu PVE. Nous avons pour objectif de compléter chaque palier de raid en mode héroïque.
        Pour cela nous raidons trois soirs par semaine: le mardi, le jeudi et le dimanche de 20h50 à
        minuit.
      </p>
      <p></p>
      <StyledTitle level={2} id="recruitment">
        Recrutement
      </StyledTitle>
      <p>
        Nous ne recherchons pas de classe / spécialisation en particulier mais des joueurs qui
        comprennent leur spé et capable de s'intégrer dans le roster. Notre système de recrutement
        peut parraître fastidieux et "old school", cependant il nous permet de nous assurer de votre
        motivation.
      </p>
      <p>
        La procédure de recrutement se déroule de la façon suivante:
        <ol>
          <li>Créez un compte et postez votre candidature en cliquant sur le bouton plus bas.</li>
          <li>Les membres de la guilde posent leur questions / reactions sur votre candidature.</li>
          <li>
            Si votre candidature nous intéresse, vous êtes invité pour une période de test d'une
            durée d'un mois pour s'assurer de votre engagement et que le courant passe avec le reste
            de la guilde.
          </li>
          <li>
            Si vous passez cette période de test, félicitation vous faites officiellement partie de
            la guilde !
          </li>
        </ol>
      </p>
      <Button type="primary" onClick={() => router.push("/applies")}>
        Accès aux candidatures
      </Button>

      <StyledTitle level={2} id="contact">
        Contact
      </StyledTitle>
      <p>
        En cas de question ou de problème, n'hésitez pas à rejoindre le{" "}
        <a href="https://discord.gg/RbcbBsD" target="_blank" rel="noopener noreferrer">
          discord
        </a>{" "}
        de la guilde pour en faire part ou à contacter en privé un officier (Haut Conseiller ou
        Gardien) en jeu ou sur discord.
      </p>
      <p>Pour les problèmes concernant le site, contactez Alco#0822 sur discord.</p>
      <StyledTitle level={2} id="progress">
        Progress
      </StyledTitle>
      <Timeline style={{ marginTop: "3rem" }}>
        <Timeline.Item color="grey">Sépulcre des fondateurs : 11/11 Héroïque</Timeline.Item>
        <Timeline.Item color="grey">Sanctum de Domination : 10/10 Héroïque</Timeline.Item>
        <Timeline.Item color="grey">Château Nathria : 10/10 Héroïque</Timeline.Item>
        <Timeline.Item color="blue">Ny'alotha : 12/12 Héroïque</Timeline.Item>
        <Timeline.Item color="blue">Palais Eternel : 3/8 Mythique</Timeline.Item>
        <Timeline.Item color="blue">Creuset des Tempêtes : 2/2 Héroïque</Timeline.Item>
        <Timeline.Item color="blue">Bataille de Dazar'alor : 9/9 Héroïque</Timeline.Item>
        <Timeline.Item color="blue">Uldir : 1/8 Mythique</Timeline.Item>
        <Timeline.Item color="green">Antorus : 11/11 Héroïque</Timeline.Item>
        <Timeline.Item color="green">Tombe de Sargeras : 9/9 Héroïque</Timeline.Item>
        <Timeline.Item color="green">Palais Sacrenuit : 10/10 Héroïque</Timeline.Item>
        <Timeline.Item color="green">Le Jugement des Valeureux : 3/3 Héroïque</Timeline.Item>
        <Timeline.Item color="green">Le Cauchemar d'émeraude : 7/7 Héroïque</Timeline.Item>
      </Timeline>
    </>
  );
};

export default Home;
