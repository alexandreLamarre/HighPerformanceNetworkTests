import React from "react";
import {createNetworkSystem} from "../Graphics/NetworkSystem";

/**
 * Network component that handles the network canvas
 */
export default class NetworkComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {};
        this.canvas = React.createRef();
        this.resize = this.resize.bind(this);
        this.graphics = null;
    }

    componentDidMount(){
        this.graphics = createNetworkSystem(this.canvas.current, this.width(), this.height(), 55000);
        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);
        this.draw()
        window.addEventListener("resize", this.resize);
        window.requestAnimationFrame(() => this.animate());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.resize);
    }

    animate(){
        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);
        window.requestAnimationFrame(() => this.animate());
    }

    draw(){

    }


    /**
     * Adjusts the canvas and renderer size when the window resize listener i
     * is called
     */
    resize(){
        if(this.canvas.current !== null){
            const w = this.width(); const h = this.height();
            this.setCanvas(w,h);
            this.graphics.camera.aspect = w/h;
            this.graphics.renderer.setSize(w,h);
            this.graphics.controls.target.set(w/2, h/2,  h/2);
            this.graphics.controls.update();
        }
    }

    width(){
        return window.innerWidth * 0.95;
    }

    height(){
        return window.innerHeight * 0.95;
    }

    setCanvas(width, height){
        this.canvas.current.width = width;
        this.canvas.current.height = height;
    }


    render(){
        return(<div>
            <canvas ref = {this.canvas} style = {{backgroundColor: "black"}}/>
        </div>);
    }
}