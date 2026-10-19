import type { IAuthenticateGeneric, ICredentialTestRequest, ICredentialType, INodeProperties } from 'n8n-workflow';
export class LegaionApi implements ICredentialType {
 name = 'legaionApi'; displayName = 'LEGAION API';
 icon = { light: 'file:../nodes/Legaion/legaion.svg', dark: 'file:../nodes/Legaion/legaion.svg' } as const;
 documentationUrl = 'https://rkryjteyfzgxisnmykek.supabase.co/functions/v1/partner-verification/docs';
 properties: INodeProperties[] = [{displayName:'API Key',name:'apiKey',type:'string',typeOptions:{password:true},default:'',required:true,description:'An organisation API key with the engine:verify scope'}];
 authenticate: IAuthenticateGeneric = {type:'generic',properties:{headers:{Authorization:'=Bearer {{$credentials.apiKey}}'}}};
 test: ICredentialTestRequest = {request:{baseURL:'https://rkryjteyfzgxisnmykek.supabase.co/functions/v1/partner-verification',url:'/account',method:'GET'}};
}
