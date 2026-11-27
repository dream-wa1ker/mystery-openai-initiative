import math,random,wave,struct,pathlib
random.seed(9)
root=pathlib.Path('assets/ninth/audio');root.mkdir(parents=True,exist_ok=True)
rate=22050
morse={'E':'.','C':'-.-.','H':'....','O':'---','I':'..','X':'-..-'}
def tone(duration,freq=610,level=.3):
 n=int(duration*rate)
 return [math.sin(2*math.pi*freq*i/rate)*level*min(1,i/(rate*.008),(n-i)/(rate*.008)) for i in range(n)]
def silence(t):return [0.0]*int(t*rate)
def signal(text,unit=.12):
 out=silence(.4)
 for li,ch in enumerate(text):
  for si,s in enumerate(morse[ch]):
   out+=tone(unit*(3 if s=='-' else 1))
   if si<len(morse[ch])-1:out+=silence(unit)
  if li<len(text)-1:out+=silence(unit*3)
 return out+silence(.7)
def save(name,values):
 with wave.open(str(root/(name+'.wav')),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate)
  f.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,v))*32767)) for v in values))
save('receiver-echo',signal('ECHO'))
save('final-signal',signal('ECHO',.17))
save('verified',tone(.12,523,.2)+tone(.15,659,.18)+tone(.23,784,.13))
save('pin',tone(.035,1050,.15)+tone(.07,750,.1))
paper=[]
for i in range(int(rate*.32)):
 paper.append((random.random()*2-1)*.16*math.sin(math.pi*i/(rate*.32))**2)
save('paper',paper)
room=[];brown=0
for i in range(rate*12):
 brown=(brown+(random.random()*2-1)*.025)/1.015
 envelope=.75+.25*math.sin(2*math.pi*i/(rate*12))**2
 room.append((brown*.35+math.sin(2*math.pi*55*i/rate)*.018+math.sin(2*math.pi*83*i/rate)*.008)*envelope)
save('room-tone',room)
print('Created six local audio assets.')
