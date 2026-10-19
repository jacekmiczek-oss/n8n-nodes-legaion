import { NodeConnectionTypes, NodeOperationError, type IExecuteFunctions, type INodeExecutionData, type INodeType, type INodeTypeDescription, type IDataObject } from 'n8n-workflow';
const BASE = 'https://rkryjteyfzgxisnmykek.supabase.co/functions/v1/partner-verification';
export class Legaion implements INodeType {
 description: INodeTypeDescription = {
  displayName:'LEGAION',name:'legaion',icon:{light:'file:legaion.svg',dark:'file:legaion.svg'},group:['transform'],version:1,
  subtitle:'={{$parameter["operation"]}}',description:'Start document verification and retrieve its findings',defaults:{name:'LEGAION'},
  inputs:[NodeConnectionTypes.Main],outputs:[NodeConnectionTypes.Main],credentials:[{name:'legaionApi',required:true}],
  properties:[
   {displayName:'Operation',name:'operation',type:'options',noDataExpression:true,default:'start',options:[{name:'Start Verification',value:'start',description:'Submit text for asynchronous verification',action:'Start verification'},{name:'Get Verification',value:'get',description:'Retrieve a job status and findings',action:'Get verification'}]},
   {displayName:'Text',name:'documentContent',type:'string',typeOptions:{rows:6},default:'',required:true,displayOptions:{show:{operation:['start']}},description:'Text to send to LEGAION; maximum 60,000 characters'},
   {displayName:'Document Type',name:'documentType',type:'string',default:'document',displayOptions:{show:{operation:['start']}}},
   {displayName:'Output Language',name:'outputLanguage',type:'options',default:'pl',options:[{name:'English',value:'en'},{name:'Polish',value:'pl'}],displayOptions:{show:{operation:['start']}}},
   {displayName:'Request ID',name:'requestId',type:'string',default:'',required:true,displayOptions:{show:{operation:['start']}},description:'Stable unique ID for this document version (8–128 letters, digits, dots, colons, underscores or hyphens). Reuse on retries to avoid duplicate verification.'},
   {displayName:'Job ID',name:'jobId',type:'string',default:'',required:true,displayOptions:{show:{operation:['get']}},description:'The ID returned by Start Verification'},
  ],
		usableAsTool: true,
 };
 async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
  const output: INodeExecutionData[] = [];
  for (let i=0;i<this.getInputData().length;i++) {
   const operation=this.getNodeParameter('operation',i) as string;
   let data: IDataObject;
   if (operation==='start') {
    const documentContent=this.getNodeParameter('documentContent',i) as string;
    const requestId=this.getNodeParameter('requestId',i) as string;
    if (!documentContent.trim() || documentContent.length>60000) throw new NodeOperationError(this.getNode(),'Text must contain 1–60,000 characters',{itemIndex:i});
    if (!/^[a-zA-Z0-9_.:-]{8,128}$/.test(requestId)) throw new NodeOperationError(this.getNode(),'Invalid request ID',{itemIndex:i});
    data=await this.helpers.httpRequestWithAuthentication.call(this,'legaionApi',{method:'POST',url:BASE+'/jobs',headers:{'Idempotency-Key':requestId},body:{documentContent,documentType:this.getNodeParameter('documentType',i),outputLanguage:this.getNodeParameter('outputLanguage',i)},json:true,timeout:20000}) as IDataObject;
   } else {
    const id=this.getNodeParameter('jobId',i) as string;
    if (!/^[0-9a-f-]{36}$/.test(id)) throw new NodeOperationError(this.getNode(),'Invalid job ID',{itemIndex:i});
    data=await this.helpers.httpRequestWithAuthentication.call(this,'legaionApi',{method:'GET',url:BASE+'/jobs/'+id,json:true,timeout:20000}) as IDataObject;
   }
   output.push({json:data,pairedItem:{item:i}});
  }
  return [output];
 }
}
