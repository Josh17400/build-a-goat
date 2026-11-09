// ---------- the OVR you see: the display scale, and letter grades ----------
const DSP=[[40,38],[62,60],[69.7,70],[73,77],[80.6,85],[82.1,90],[87.4,95],[93,99]];
function dsp(x){x-=((diff().lg||0)-2)*.6*clamp((x-40)/30,0,1);if(x<=DSP[0][0])return Math.round(clamp(x-2,1,99));for(let i=1;i<DSP.length;i++){const[a,A]=DSP[i-1],[b,B]=DSP[i];if(x<=b)return Math.round(A+(x-a)/(b-a)*(B-A));}return 99;}
const OV=()=>dsp(ovr());
function grade(n){return n>=92?'A+':n>=87?'A':n>=83?'A-':n>=79?'B+':n>=75?'B':n>=71?'B-':n>=67?'C+':n>=63?'C':n>=58?'C-':'D';}
