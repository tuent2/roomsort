import { _decorator, Component, director, EventTouch, find, Layers, Node, tween, UITransform, v3, Vec2 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {
    static instance: GameController = null;
    @property(Node)
    targetNode: Node | null = null;

    private isDragging: boolean = false;

    @property(Node) StageChain1: Node = null;
    @property(Node) StageChain2: Node = null;
    @property(Node) StageChain3: Node = null;

    scaleObject(targetNode: Node) {
        // Bắt đầu scale từ 0
        targetNode.setScale(0, 0, 0);

        // Sử dụng Tween để scale từ 0 đến 1 trong 1 giây
        tween(targetNode)
            .to(1, { scale: v3(1, 1, 1) })
            .start();
    }

    addInputEvent() {
        const canvas = find('Canvas');
        canvas.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
        // canvas.on(Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
    }
s
    removeInputEvent() {
        const canvas = find('Canvas');
        canvas.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
        canvas.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        canvas.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onTouchStart(event: EventTouch) {
        if (this.node.layer === Layers.nameToLayer('target')) {
            console.log('Sprite with layer "target" is clicked!');
            this.isDragging = true;
        }
    }

    onTouchMove(event: EventTouch) {
        if (this.isDragging) {
            // Di chuyển sprite theo chuột
            const delta = event.getDelta();
            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y);
        }
    }

    onTouchEnd(event: EventTouch) {
        if (this.isDragging) {
            this.isDragging = false;
            console.log('Released sprite');
        }
    }

    

}


