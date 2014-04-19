package Processors;

public class DotPlotProcessor implements HistogramProcessor {
	
	private DataProcessor dataProcessor;
	private String histogram;
	private String[] intervalsValue;

	public DotPlotProcessor(String string){
		intervalsValue = new String[20];
		intervalsValue[0] = "*";
		for(int i = 1; i < 20 ; i++ ){
			intervalsValue[i] = intervalsValue[i].concat("*"); 
		}
		setData(string);	
	}
	
	public void setData(String string){
		dataProcessor = new DataProcessor(string);
		generateHistogram();
	}
	private void generateHistogram(){
		
		
		
	}
	
	public String getHistogram() {
		return histogram;
	}
}
