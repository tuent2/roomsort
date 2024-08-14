import { _decorator, Camera, Component, EventTouch, find, Input, Layers, Node, Rect, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Room')
export class Room extends Component {
    @property(Camera) public camera: Camera | null = null; // Gán camera từ Editor
    @property(Node) public targetShape: Node = null;
    initialPosition: Vec3 = new Vec3();
    isDragging: boolean = true;
    isInShape: boolean = false;

    @property targetPosition: Vec3 = new Vec3();
    //@property canStayPosition2: Vec3[] = [];
    @property(Vec3) public canStayPosition: Vec3[] = [];

    start() {
        this.initialPosition.set(this.node.worldPosition);
        // Đăng ký sự kiện nhấn chuột
        this.node.on(Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(Node.EventType.TOUCH_MOVE, this.onMouseMove, this);
        this.node.on(Node.EventType.TOUCH_CANCEL, this.onMouseUp, this);
        this.node.on(Node.EventType.TOUCH_END, this.onMouseUp, this);
    }

    onMouseDown(event: EventTouch) {
        // Kiểm tra nếu layer của sprite là "target"
        //if (this.node.layer === Layers.nameToLayer('target')) {
        //console.log('Sprite with layer "target" is clicked!');
        //console.log(1);
        this.isDragging = true;
        this.node.scale = new Vec3(1, 1, 1);
        const delta = event.getDelta();
        if (!this.isInShape)
            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y + 200);
        else
            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y);
        //}
    }

    onMouseMove(event: EventTouch) {
        //console.log(2);
        if (this.isDragging) {
            // Di chuyển sprite theo chuột
            const delta = event.getDelta();

            this.node.setPosition(this.node.position.x + delta.x, this.node.position.y + delta.y);
            // this.node.scale = new Vec3(1, 1, 1);
        }
    }

    onMouseUp(event: EventTouch) {
        //console.log(3);
        if (this.isDragging) {
            this.isDragging = false;
            const movingBox = this.node.getComponent(UITransform).getBoundingBoxToWorld();
            const targetBox = this.targetShape.getComponent(UITransform).getBoundingBoxToWorld();

            // Kiểm tra xem movingBox có nằm hoàn toàn trong targetBox hay không
            if (this.isBoxInside(movingBox, targetBox)) {
                console.log("The shape can fit into the target shape.");
                this.isInShape = true;
            } else {
                console.log("The shape cannot fit into the target shape.");
                this.isInShape = false;
                this.node.scale = new Vec3(0.9, 0.9, 0.9)
                this.node.setWorldPosition(this.initialPosition);
            }
            // console.log('Released sprite');
            // this.node.scale = new Vec3(0.9, 0.9, 0.9)
            // this.node.setWorldPosition(this.initialPosition);
        }
    }

    isBoxInside(innerBox: Rect, outerBox: Rect): boolean {
        // Kiểm tra xem tất cả các cạnh của innerBox có nằm trong outerBox hay không
        return (
            innerBox.xMin >= outerBox.xMin &&
            innerBox.xMax <= outerBox.xMax &&
            innerBox.yMin >= outerBox.yMin &&
            innerBox.yMax <= outerBox.yMax
        );
    }
}
