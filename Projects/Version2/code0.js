gdjs.GameCode = {};
gdjs.GameCode.GDRocketBabuObjects1= [];
gdjs.GameCode.GDRocketBabuObjects2= [];
gdjs.GameCode.GDPipeObjects1= [];
gdjs.GameCode.GDPipeObjects2= [];
gdjs.GameCode.GDPipe2Objects1= [];
gdjs.GameCode.GDPipe2Objects2= [];
gdjs.GameCode.GDTextObjects1= [];
gdjs.GameCode.GDTextObjects2= [];
gdjs.GameCode.GDtest1Objects1= [];
gdjs.GameCode.GDtest1Objects2= [];
gdjs.GameCode.GDtest2Objects1= [];
gdjs.GameCode.GDtest2Objects2= [];

gdjs.GameCode.conditionTrue_0 = {val:false};
gdjs.GameCode.condition0IsTrue_0 = {val:false};
gdjs.GameCode.condition1IsTrue_0 = {val:false};
gdjs.GameCode.condition2IsTrue_0 = {val:false};
gdjs.GameCode.condition3IsTrue_0 = {val:false};


gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects = Hashtable.newFrom({"RocketBabu": gdjs.GameCode.GDRocketBabuObjects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipeObjects1Objects = Hashtable.newFrom({"Pipe": gdjs.GameCode.GDPipeObjects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects = Hashtable.newFrom({"RocketBabu": gdjs.GameCode.GDRocketBabuObjects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipe2Objects1Objects = Hashtable.newFrom({"Pipe2": gdjs.GameCode.GDPipe2Objects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects = Hashtable.newFrom({"RocketBabu": gdjs.GameCode.GDRocketBabuObjects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipeObjects1Objects = Hashtable.newFrom({"Pipe": gdjs.GameCode.GDPipeObjects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects = Hashtable.newFrom({"RocketBabu": gdjs.GameCode.GDRocketBabuObjects1});
gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipe2Objects1Objects = Hashtable.newFrom({"Pipe2": gdjs.GameCode.GDPipe2Objects1});
gdjs.GameCode.eventsList0 = function(runtimeScene) {

{



}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
gdjs.GameCode.condition2IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) > -(5);
}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
gdjs.GameCode.condition1IsTrue_0.val = gdjs.evtTools.input.isMouseButtonPressed(runtimeScene, "Left");
}if ( gdjs.GameCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() > 0 ) {
        gdjs.GameCode.condition2IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.GameCode.condition2IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(-(10));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
gdjs.GameCode.condition2IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.input.isKeyPressed(runtimeScene, "Space");
}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
gdjs.GameCode.condition1IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) > -(5);
}if ( gdjs.GameCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() > 0 ) {
        gdjs.GameCode.condition2IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.GameCode.condition2IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(0).setNumber(-(10));
}}

}


{



}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
}if (gdjs.GameCode.condition0IsTrue_0.val) {
{runtimeScene.getVariables().getFromIndex(1).setNumber(100);
}{runtimeScene.getVariables().getFromIndex(2).setNumber(100);
}{runtimeScene.getVariables().get("Offset3").setNumber(100);
}{runtimeScene.getVariables().get("Offset4").setNumber(100);
}{runtimeScene.getVariables().get("PipeX").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene));
}{runtimeScene.getVariables().get("Pipe2X").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene) + gdjs.evtTools.window.getGameResolutionWidth(runtimeScene) / 2 + 50);
}{gdjs.evtTools.window.centerWindow(runtimeScene);
}{gdjs.evtTools.window.setAdaptGameResolutionAtRuntime(runtimeScene, true);
}{runtimeScene.getVariables().getFromIndex(3).setNumber(0);
}}

}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.common.logicalNegation(false);
}if (gdjs.GameCode.condition0IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("Pipe"), gdjs.GameCode.GDPipeObjects1);
gdjs.copyArray(runtimeScene.getObjects("Pipe2"), gdjs.GameCode.GDPipe2Objects1);
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);
gdjs.copyArray(runtimeScene.getObjects("Text"), gdjs.GameCode.GDTextObjects1);
{runtimeScene.getVariables().getFromIndex(0).add(0.5);
}{for(var i = 0, len = gdjs.GameCode.GDRocketBabuObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDRocketBabuObjects1[i].setY(gdjs.GameCode.GDRocketBabuObjects1[i].getY() + (gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0))));
}
}{for(var i = 0, len = gdjs.GameCode.GDPipeObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDPipeObjects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")), -(10), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) - 100);
}
}{for(var i = 0, len = gdjs.GameCode.GDPipe2Objects1.length ;i < len;++i) {
    gdjs.GameCode.GDPipe2Objects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")), -(10), gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(2)) - 100);
}
}{for(var i = 0, len = gdjs.GameCode.GDPipeObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDPipeObjects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")), gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) + 100, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) + 10);
}
}{for(var i = 0, len = gdjs.GameCode.GDPipe2Objects1.length ;i < len;++i) {
    gdjs.GameCode.GDPipe2Objects1[i].drawRectangle(gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")), gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(2)) + 100, gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) + 100, gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) + 10);
}
}{runtimeScene.getVariables().get("PipeX").sub(8);
}{runtimeScene.getVariables().get("Pipe2X").sub(8);
}{for(var i = 0, len = gdjs.GameCode.GDTextObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDTextObjects1[i].setString(gdjs.evtTools.variable.getVariableString(runtimeScene.getVariables().getFromIndex(3)));
}
}}

}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) > 0;
}if (gdjs.GameCode.condition0IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);
{for(var i = 0, len = gdjs.GameCode.GDRocketBabuObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDRocketBabuObjects1[i].setAnimationFrame(0);
}
}}

}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(0)) <= 0;
}if (gdjs.GameCode.condition0IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);
{for(var i = 0, len = gdjs.GameCode.GDRocketBabuObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDRocketBabuObjects1[i].setAnimationFrame(1);
}
}}

}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) <= -(100);
}if (gdjs.GameCode.condition0IsTrue_0.val) {
{runtimeScene.getVariables().get("PipeX").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene));
}{runtimeScene.getVariables().getFromIndex(1).setNumber(gdjs.randomInRange(-(250), 250));
}}

}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) <= -(100);
}if (gdjs.GameCode.condition0IsTrue_0.val) {
{runtimeScene.getVariables().get("Pipe2X").setNumber(gdjs.evtTools.window.getGameResolutionWidth(runtimeScene));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("Pipe"), gdjs.GameCode.GDPipeObjects1);
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects, gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipeObjects1Objects, false, runtimeScene, false);
}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() < gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) - 100 ) {
        gdjs.GameCode.condition1IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
if (gdjs.GameCode.condition1IsTrue_0.val) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, gdjs.evtTools.runtimeScene.getSceneName(runtimeScene));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("Pipe2"), gdjs.GameCode.GDPipe2Objects1);
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects, gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipe2Objects1Objects, false, runtimeScene, false);
}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() < gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(2)) - 100 ) {
        gdjs.GameCode.condition1IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
if (gdjs.GameCode.condition1IsTrue_0.val) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, gdjs.evtTools.runtimeScene.getSceneName(runtimeScene));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("Pipe"), gdjs.GameCode.GDPipeObjects1);
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects, gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipeObjects1Objects, false, runtimeScene, false);
}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() > gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(1)) + 25 ) {
        gdjs.GameCode.condition1IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
if (gdjs.GameCode.condition1IsTrue_0.val) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, gdjs.evtTools.runtimeScene.getSceneName(runtimeScene));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("Pipe2"), gdjs.GameCode.GDPipe2Objects1);
gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.object.hitBoxesCollisionTest(gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDRocketBabuObjects1Objects, gdjs.GameCode.mapOfGDgdjs_46GameCode_46GDPipe2Objects1Objects, false, runtimeScene, false);
}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() > gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) / 2 - gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().getFromIndex(2)) + 25 ) {
        gdjs.GameCode.condition1IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
if (gdjs.GameCode.condition1IsTrue_0.val) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, gdjs.evtTools.runtimeScene.getSceneName(runtimeScene));
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
gdjs.GameCode.condition2IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getX() > gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) ) {
        gdjs.GameCode.condition0IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
gdjs.GameCode.condition1IsTrue_0.val = gdjs.evtTools.variable.getVariableBoolean(runtimeScene.getVariables().getFromIndex(4), false);
}if ( gdjs.GameCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getX() < gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) + 100 ) {
        gdjs.GameCode.condition2IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.GameCode.condition2IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("Text"), gdjs.GameCode.GDTextObjects1);
{gdjs.evtTools.variable.setVariableBoolean(runtimeScene.getVariables().getFromIndex(4), true);
}{runtimeScene.getVariables().getFromIndex(3).add(1);
}{for(var i = 0, len = gdjs.GameCode.GDTextObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDTextObjects1[i].setString(gdjs.evtTools.variable.getVariableString(runtimeScene.getVariables().getFromIndex(3)));
}
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
gdjs.GameCode.condition2IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getX() > gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) ) {
        gdjs.GameCode.condition0IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
gdjs.GameCode.condition1IsTrue_0.val = gdjs.evtTools.variable.getVariableBoolean(runtimeScene.getVariables().getFromIndex(4), false);
}if ( gdjs.GameCode.condition1IsTrue_0.val ) {
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getX() < gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100 ) {
        gdjs.GameCode.condition2IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}}
}
if (gdjs.GameCode.condition2IsTrue_0.val) {
gdjs.copyArray(runtimeScene.getObjects("Text"), gdjs.GameCode.GDTextObjects1);
{gdjs.evtTools.variable.setVariableBoolean(runtimeScene.getVariables().getFromIndex(4), true);
}{runtimeScene.getVariables().getFromIndex(3).add(1);
}{for(var i = 0, len = gdjs.GameCode.GDTextObjects1.length ;i < len;++i) {
    gdjs.GameCode.GDTextObjects1[i].setString(gdjs.evtTools.variable.getVariableString(runtimeScene.getVariables().getFromIndex(3)));
}
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getX() > gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("PipeX")) + 100 ) {
        gdjs.GameCode.condition0IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
gdjs.GameCode.condition1IsTrue_0.val = gdjs.evtTools.variable.getVariableBoolean(runtimeScene.getVariables().getFromIndex(4), true);
}}
if (gdjs.GameCode.condition1IsTrue_0.val) {
{gdjs.evtTools.variable.setVariableBoolean(runtimeScene.getVariables().getFromIndex(4), false);
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
gdjs.GameCode.condition1IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getX() > gdjs.evtTools.variable.getVariableNumber(runtimeScene.getVariables().get("Pipe2X")) + 100 ) {
        gdjs.GameCode.condition0IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}if ( gdjs.GameCode.condition0IsTrue_0.val ) {
{
gdjs.GameCode.condition1IsTrue_0.val = gdjs.evtTools.variable.getVariableBoolean(runtimeScene.getVariables().getFromIndex(4), true);
}}
if (gdjs.GameCode.condition1IsTrue_0.val) {
{gdjs.evtTools.variable.setVariableBoolean(runtimeScene.getVariables().getFromIndex(4), false);
}}

}


{

gdjs.copyArray(runtimeScene.getObjects("RocketBabu"), gdjs.GameCode.GDRocketBabuObjects1);

gdjs.GameCode.condition0IsTrue_0.val = false;
{
for(var i = 0, k = 0, l = gdjs.GameCode.GDRocketBabuObjects1.length;i<l;++i) {
    if ( gdjs.GameCode.GDRocketBabuObjects1[i].getY() > gdjs.evtTools.window.getGameResolutionHeight(runtimeScene) ) {
        gdjs.GameCode.condition0IsTrue_0.val = true;
        gdjs.GameCode.GDRocketBabuObjects1[k] = gdjs.GameCode.GDRocketBabuObjects1[i];
        ++k;
    }
}
gdjs.GameCode.GDRocketBabuObjects1.length = k;}if (gdjs.GameCode.condition0IsTrue_0.val) {
{gdjs.evtTools.runtimeScene.pushScene(runtimeScene, gdjs.evtTools.runtimeScene.getSceneName(runtimeScene));
}}

}


{


gdjs.GameCode.condition0IsTrue_0.val = false;
{
gdjs.GameCode.condition0IsTrue_0.val = gdjs.evtTools.runtimeScene.sceneJustBegins(runtimeScene);
}if (gdjs.GameCode.condition0IsTrue_0.val) {
{gdjs.evtTools.runtimeScene.setBackgroundColor(runtimeScene, "130;188;255");
}}

}


};

gdjs.GameCode.func = function(runtimeScene) {
runtimeScene.getOnceTriggers().startNewFrame();

gdjs.GameCode.GDRocketBabuObjects1.length = 0;
gdjs.GameCode.GDRocketBabuObjects2.length = 0;
gdjs.GameCode.GDPipeObjects1.length = 0;
gdjs.GameCode.GDPipeObjects2.length = 0;
gdjs.GameCode.GDPipe2Objects1.length = 0;
gdjs.GameCode.GDPipe2Objects2.length = 0;
gdjs.GameCode.GDTextObjects1.length = 0;
gdjs.GameCode.GDTextObjects2.length = 0;
gdjs.GameCode.GDtest1Objects1.length = 0;
gdjs.GameCode.GDtest1Objects2.length = 0;
gdjs.GameCode.GDtest2Objects1.length = 0;
gdjs.GameCode.GDtest2Objects2.length = 0;

gdjs.GameCode.eventsList0(runtimeScene);
return;

}

gdjs['GameCode'] = gdjs.GameCode;
