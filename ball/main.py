@namespace
class SpriteKind:
    Platform = SpriteKind.create()

def on_on_overlap(sprite, otherSprite):
    global yVel, platformY, platformX, Platforms
    if yVel > 0:
        yVel = -150
        platformY += -50
        platformX = randint(10, 50)
        scene.camera_shake(3, 200)
        Platforms = sprites.create(img("""
                . . c c c c c c c c c c c . . 
                            . c 1 1 1 1 1 1 1 1 1 1 1 c . 
                            c d d d d d d d d d d d d d c 
                            . c b b b b b b b b b b b c . 
                            . . c c c c c c c c c c c . .
            """),
            SpriteKind.Platform)
        if randint(1, 2) == 1:
            Platforms.set_position(Platforms.x + platformX, platformY)
        else:
            Platforms.set_position(Platforms.x - platformX, platformY)
sprites.on_overlap(SpriteKind.player, SpriteKind.Platform, on_on_overlap)

yVel = 0
Platforms: Sprite = None
platformX = 0
platformY = 0
scene.set_background_color(12)
platformY = 110
platformX = 0
Ball = sprites.create(img("""
        . . c c c . . 
            . c d d 1 c . 
            c b d d d 1 c 
            c b d d d d c 
            c b b d d d c 
            . c b b b c . 
            . . c c c . .
    """),
    SpriteKind.player)
Platforms = sprites.create(img("""
        . . c c c c c c c c c c c . . 
            . c 1 1 1 1 1 1 1 1 1 1 1 c . 
            c d d d d d d d d d d d d d c 
            . c b b b b b b b b b b b c . 
            . . c c c c c c c c c c c . .
    """),
    SpriteKind.Platform)
Platforms.set_position(80, platformY)
effects.star_field.start_screen_effect()
for index in range(4):
    Platforms = sprites.create(img("""
            . . c c c c c c c c c c c . . 
                    . c 1 1 1 1 1 1 1 1 1 1 1 c . 
                    c d d d d d d d d d d d d d c 
                    . c b b b b b b b b b b b c . 
                    . . c c c c c c c c c c c . .
        """),
        SpriteKind.Platform)
    platformY += -50
    platformX = randint(10, 70)
    print(platformX)
    if randint(1, 2) == 1:
        Platforms.set_position(Platforms.x + platformX, platformY)
    else:
        Platforms.set_position(Platforms.x - platformX, platformY)
controller.move_sprite(Ball, 50, 0)

def on_forever():
    global yVel
    Ball.set_velocity(0, yVel)
    yVel += 5
    scene.camera_follow_sprite(Ball)
forever(on_forever)
