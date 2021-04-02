import React from "react";
import {createNetworkSystem} from "../Graphics/NetworkSystem";
import TimedChunk from "../Datatypes/TimedChunk";
import {updatePositionsFromScalar} from "../Graphics/Updates";
import NavBar from "./NavBar";

/**
 * Network component that handles the network canvas
 */
export default class NetworkComponent extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            prevHeight: 1,
            prevWidth: 1,
        };
        this.canvas = React.createRef();
        this.resize = this.resize.bind(this);
        this.pointerMove = this.onPointerMove.bind(this);
        this.graphics = null;
    }

    componentDidMount(){
        const w = this.width(); const h = this.height();
        this.setState({prevHeight: h, prevWidth: w});
        this.graphics = createNetworkSystem(this.canvas.current, w, h, 100000, 150000);
        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);
        document.addEventListener("pointermove", this.pointerMove)
        window.addEventListener("resize", this.resize);
        window.requestAnimationFrame(() => this.animate());
    }

    componentWillUnmount() {
        window.removeEventListener("pointermove", this.pointerMove);
        window.removeEventListener("resize", this.resize);
    }

    animate(){
        this.graphics.renderer.render(this.graphics.scene, this.graphics.camera);

        //update intersection
        this.graphics.raycaster.setFromCamera(this.graphics.pointer, this.graphics.camera);
        const intersects = this.graphics.raycaster.intersectObjects(this.graphics.scene.children);

        if(intersects.length > 0){
            this.graphics.cursor.visible = true;
            for(let i = 0; i < intersects.length; i++){
                if (intersects[i].distance > 50){
                    if(intersects[i].object !== this.graphics.cursor) {
                        this.graphics.cursor.position.copy(intersects[i].point);
                    }
                    break;
                }
            }

        } else{
            this.graphics.cursor.visible = false;
        }
        window.requestAnimationFrame(() => this.animate());
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
        }
    }

    onPointerMove(e){
        if(this.canvas.current !== null){
            this.graphics.pointer.x = ((e.clientX/ this.canvas.current.width)* 2) - 1 ;
            this.graphics.pointer.y = ((e.clientY/ this.canvas.current.height) * -2) +1;
        }
    }

    width(){
        return window.innerWidth-1;
    }

    height(){
        return window.innerHeight-5;
    }

    setCanvas(width, height){
        this.canvas.current.width = width;
        this.canvas.current.height = height;
    }


    render(){
        return(<div style ={{overflowX: "hidden", overflowY: "hidden"}}>

            <canvas ref = {this.canvas} style = {{backgroundColor: "rgb(43,43,43)"}}/>
        </div>);
    }
}

