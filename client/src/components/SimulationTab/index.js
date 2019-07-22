import React from 'react'
import { Row, Col, Button} from 'reactstrap'
import {useStoreState, useStoreActions} from "easy-peasy";
import FluxControlForFBA from "./FluxControl/forFBA";
import GeneControlForFBA from "./GeneControl/forFBA";
import SimulationGraph from "./SimulationGraph";
import { TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import classnames from 'classnames';
import AnalysisInfo from "./AnalysisInfo";
import FluxResultsForFBA from "./FluxResults/forFBA";
import EssentialComponents from "./Essential Components";
import FluxControlForFVA from "./FluxControl/forFVA";
import GeneControlForFVA from "./GeneControl/forFVA";
import FluxControlForSL from "./FluxControl/forSyntheticLethality";
import { notification } from 'antd';
import 'antd/dist/antd.css';
import FluxControlForEssentiality from "./FluxControl/forEssentiality";
import FluxResultsForFVA from "./FluxResults/forFVA";


function SimulationTab() {

    const openNotificationWithIcon = type => {
        notification[type]({
            message: 'Error! ',
            description:
                'For Synthetic Lethality, you can only knockout 2 reactions or 2 genes!',
        });
    };


    const [activeTab, toggle] = React.useState( 1);

    const filename = useStoreState(state => state.modelTab.currentModel.filename);

    const {reactions,genes }= useStoreState( state => state.modelTab.currentModel);
    const {updatedReactions, updatedGenes} = useStoreState( state => state.simulationTab);

    const currentFVAReactions = useStoreState( state => state.modelTab.currentAnalysisModel.reactions);
    const currentFVAGenes= useStoreState( state => state.modelTab.currentAnalysisModel.genes);

    const analysisMetabolites = useStoreState(state => state.simulationTab.currentFBAModel.metabolites);
    const analysisReactions = useStoreState(state => state.simulationTab.currentFBAModel.reactions);
    const analysisGenes = useStoreState(state => state.simulationTab.currentFBAModel.genes);
    const name = useStoreState(state => state.simulationTab.currentFBAModel.name);
    const info = useStoreState(state=> state.simulationTab.currentFBAModel.objective_value);
    const analysisFVAReactions = useStoreState(state=> state.simulationTab.currentFVAModel.reactions);
    const analysisFVAName = useStoreState(state=>state.simulationTab.currentFVAModel.name);
    const analysisFVAInfo = useStoreState(state=> state.simulationTab.currentFVAModel.objective_value);

    const knockedOutReactions = useStoreState(state=>state.simulationTab.knockedOutReactions);
    const knockedOutGenes = useStoreState(state=>state.simulationTab.knockedOutGenes);

    const {runFluxBalanceAnalysis,runFluxVariabilityAnalysis,runEssentiality,runSyntheticLethality}=useStoreActions(actions => actions.simulationTab)

    function runFBA(e) {
        e.preventDefault();
        runFluxBalanceAnalysis({
                filename: filename,
                reactions: updatedReactions,
                genes: updatedGenes
            })
    }
    function runFVA(e) {
        console.log(updatedReactions)
        e.preventDefault();
        runFluxVariabilityAnalysis({
            reactions: updatedReactions,
            genes: updatedGenes
        })
    }
    function runEssentialityFunction(e) {
        e.preventDefault();
        runEssentiality({
            str: "essentiality"
        })
    }
    function runSyntheticLethalityFunction(e) {
        e.preventDefault();
        console.log(knockedOutReactions);
        if(knockedOutReactions.length>2){
            openNotificationWithIcon('error')
        }
        else{
            runSyntheticLethality({
                reactions: updatedReactions,
                genes: updatedGenes
            })
        }
    }
    return(
        <React.Fragment>

                <Nav tabs>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 1 })}
                            onClick={() => { toggle(1) }}>
                            Flux Balance Analysis
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 2 })}
                            onClick={() => { toggle(2) }}>
                            Flux Variability Analysis
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 3 })}
                            onClick={() => { toggle(3) }}>
                            Essentiality
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink
                            className={classnames({ active: activeTab === 4 })}
                            onClick={() => { toggle(4) }}>
                            Synthetic Lethality
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab}>
                    {/*
                        FLUX BALANCE ANALYSIS
                    */}
                    <TabPane tabId={1}>
                        <Row >
                            <Col md="7" >
                                <Row style={{padding: "20px"}}>
                                    <Col md="5">
                                        <h3>
                                        <Button
                                            onClick={
                                                runFBA
                                            }
                                            color="success" style={{position: "absolute",left: "25%"}}>Run the Simulation >
                                        </Button></h3>
                                        <br/><hr/>
                                        <AnalysisInfo name={name} info={info}/>
                                        <FluxResultsForFBA
                                            height={"450px"}
                                            updatedReactions={analysisReactions}/>
                                    </Col>
                                    <Col md="7">
                                            <FluxControlForFBA
                                                height={"325px"}
                                                knockOff={false}
                                                updatedReactions={updatedReactions}
                                                reactions={reactions}
                                            />
                                            <br/>
                                            <GeneControlForFBA
                                                updatedGenes={updatedGenes}
                                                genes={genes}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="5" >
                                <SimulationGraph metabolites={analysisMetabolites} reactions={analysisReactions}  />
                            </Col>
                        </Row>
                    </TabPane>
                    {/*
                        FLUX VARIABILITY ANALYSIS
                    */}
                    <TabPane tabId={2}>
                        <Row >
                            <Col md="7" >
                                <Row style={{padding: "20px"}}>
                                    <Col md="4">
                                        <h3>
                                            <Button
                                                onClick={
                                                    runFVA
                                                }
                                                color="success" style={{position: "absolute",left: "25%"}}>Run the Simulation >
                                            </Button>
                                        </h3>
                                        <br/><hr/>
                                    </Col>
                                    <Col md="8">
                                        <FluxControlForFVA
                                            knockOff={true}
                                            height={"325px"}
                                            updatedReactions={updatedReactions}
                                            reactions={currentFVAReactions}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{padding: "20px"}}>
                                    <Col md="4">
                                        <AnalysisInfo name={analysisFVAName} info={analysisFVAInfo}/>
                                    </Col>
                                    <Col md="8">
                                        <GeneControlForFVA
                                            updatedGenes={updatedGenes}
                                            genes={currentFVAGenes}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="5" >
                                <FluxResultsForFVA
                                    height={"750px"}
                                    updatedReactions={analysisFVAReactions}/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId={3}>
                        <Row >
                            <Col md="7" >
                                <Row style={{padding: "20px"}}>
                                    <Col md="4">
                                        <h3>
                                            <Button
                                                onClick={
                                                    runEssentialityFunction
                                                }
                                                color="success" style={{position: "absolute",left: "25%"}}>Run the Simulation >
                                            </Button>
                                        </h3>
                                        <br/><hr/>
                                        HERE THE USER WILL BE ABLE TO KNOCK OFF REACTIONS AND CONTROL FLUXES.
                                        BASED UPON THAT I WILL CALCULATE THE ESSENTIAL REACTIONS, FOR NOW, I HAVE DISPLAYED ALL THE REACTIONS JUST TO SHOW, HOW IT WOULD LOOK
                                    </Col>
                                    <Col md="8">
                                        <FluxControlForEssentiality
                                            height={"750px"}
                                            knockOff={true}
                                            updatedReactions={updatedReactions}
                                            reactions={reactions}
                                        />
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="5" >
                                <EssentialComponents
                                    height={"750px"}
                                    analysisReactions={analysisReactions}
                                    analysisGenes={analysisGenes}/>
                            </Col>
                        </Row>
                    </TabPane>
                    <TabPane tabId={4}>
                        <Row >
                            <Col md="7" >
                                <Row style={{padding: "20px"}}>
                                    <Col md="4">
                                        <h3>
                                            <Button
                                                onClick={
                                                    runSyntheticLethalityFunction
                                                }
                                                color="success" style={{position: "absolute",left: "25%"}}>Run the Simulation >
                                            </Button>
                                        </h3>
                                        <br/><hr/>
                                        HERE THE USER WILL BE ABLE TO KNOCK OFF REACTIONS OR GENES.
                                        IT WILL BE IN PAIR, TWO REACTIONS OR TWO GENES.
                                        BASED UPON THAT I WILL CALCULATE THE ESSENTIAL REACTIONS, FOR NOW, I HAVE DISPLAYED ALL THE REACTIONS AND GENES JUST TO SHOW, HOW IT WOULD LOOK
                                    </Col>
                                    <Col md="8">
                                        <FluxControlForSL
                                            knockOff={true}
                                            height={"325px"}
                                            knockedOutReactions={knockedOutReactions}
                                            updatedReactions={updatedReactions}
                                            reactions={reactions}
                                        />
                                    </Col>
                                </Row>
                                <Row style={{padding: "20px"}}>
                                    <Col md="4">
                                        <AnalysisInfo name={name} />
                                    </Col>
                                    <Col md="8">
                                        <GeneControlForFBA
                                            updatedGenes={updatedGenes}
                                            genes={genes}/>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md="5" >
                                <EssentialComponents
                                    height={"750px"}
                                    analysisReactions={analysisReactions}
                                    analysisGenes={analysisGenes}/>
                            </Col>
                        </Row>
                    </TabPane>
                </TabContent>



        </React.Fragment>
    )

}

export default SimulationTab;
