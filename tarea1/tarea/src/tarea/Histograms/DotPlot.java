package tarea.Histograms;

import tarea.Histogram;
import tarea.Processors.DotPlotProcessor;

public class DotPlot extends Histogram {

	public DotPlot(String string) {
		super();
		textData = string;
		histogramProcessor = new DotPlotProcessor(textData);
	}

	public DotPlot() {
	}
}
