package tarea.histograms;

import tarea.Histogram;
import tarea.processors.DotPlotProcessor;

public class DotPlot extends Histogram {
	
	public DotPlot() {
		textData = "";
		histogramProcessor = new DotPlotProcessor();
	}
	public DotPlot(String string) {
		textData = string;
		histogramProcessor = new DotPlotProcessor(textData);
	}
}
