package tarea.histograms;

import tarea.Histogram;
import tarea.processors.SuperDotPlotProcessor;

public class SuperDotPlot extends Histogram {

	public SuperDotPlot() {
		textData = "";
		histogramProcessor = new SuperDotPlotProcessor();
	}
	public SuperDotPlot(String string) {
		textData = string;
		histogramProcessor = new SuperDotPlotProcessor(textData);
	}	
}
