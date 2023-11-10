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
                <img
                    src="logo.png"
                    style={{ width: "10rem", position: "absolute", right: 0, top: 0 }}
                />
            </div>

            <StyledTitle level={2} id="presentation">
                Présentation
            </StyledTitle>
            <p>
                Nous sommes une guilde installée depuis très longtemps sur les serveurs Vol'jin /
                Chants Eternels et qui a pour vocation de progresser ensemble et dans une bonne
                ambiance dans le contenu PVE. Nous avons pour objectif de compléter chaque palier de
                raid en mode héroïque. Pour cela nous raidons trois soirs par semaine: le mardi, le
                jeudi et le dimanche de 20h50 à minuit.
            </p>
            <p></p>
            <StyledTitle level={2} id="recruitment">
                Recrutement
            </StyledTitle>
            <p>Le recrutement a été déplacé sur notre serveur discord !</p>
            <Button type="primary" onClick={() => window.open("https://discord.gg/RbcbBsD")}>
                Accès au discord
            </Button>

            <StyledTitle level={2} id="contact">
                Contact
            </StyledTitle>
            <p>
                En cas de question ou de problème, n'hésitez pas à rejoindre le{" "}
                <a href="https://discord.gg/RbcbBsD" target="_blank" rel="noopener noreferrer">
                    discord
                </a>{" "}
                de la guilde pour en faire part ou à contacter en privé un officier (Haut Conseiller
                ou Gardien) en jeu ou sur discord.
            </p>
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
                <Timeline.Item color="green">
                    Le Jugement des Valeureux : 3/3 Héroïque
                </Timeline.Item>
                <Timeline.Item color="green">Le Cauchemar d'émeraude : 7/7 Héroïque</Timeline.Item>
            </Timeline>
        </>
    );
};

export default Home;
