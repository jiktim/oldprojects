using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using SKYPE4COMLib;

namespace StupidSkype
{
    public partial class Form1 : Form
    {
        private Skype _skype = new Skype();
        private readonly TabPage[] tabs;
        public Form1()
        {
            InitializeComponent();
            tabs = new TabPage[] 
            {
                tabHome,
                tabSettings,
                tabOther,
                tabMessaging,
                tabCall
            };
        }
        private int ContactCounter { get; set; } = 0;
        private bool Connected { get; set; } = false;
        private void Button1_Click(object sender, EventArgs e)
        {
            _skype.Attach();
            Connected = true;
            homelabName.Text = "Name: " + _skype.CurrentUserProfile.FullName;
            homelabMood.Text = "Mood: " + _skype.CurrentUserProfile.MoodText;
            foreach (User user in _skype.Friends)
            {
                comboBox2.Items.Add(user.Handle);
                ContactCounter++;
            }
            homelabContacts.Text = "Contacts: " + ContactCounter;
            ContactCounter = 0;
            homelabStatus.ForeColor = Color.LimeGreen;
            homelabStatus.Text = "Connected ^^";
        }
        
        private void RadioButton1_CheckedChanged(object sender, EventArgs e)
        {
            ActiveForm.BackColor = Color.White;
            ChangeAllTabsColor(Color.White);
        }
        private void ChangeAllTabsColor(Color c)
        {
            foreach (var item in tabs)
            {
                item.BackColor = c;
            }
        } 
        private void RadioButton2_CheckedChanged(object sender, EventArgs e)
        {
            ActiveForm.BackColor = Color.LightGray;
            ChangeAllTabsColor(Color.LightGray);
        }

        private void MsgbutMass_Click(object sender, EventArgs e)
        {
            foreach (User user in _skype.Friends)
            {
                comboBox2.Items.Add(user.Handle);
            }
        }

        private void Timer1_Tick(object sender, EventArgs e)
        {

        }

        private void Msgbutspam1_Click(object sender, EventArgs e)
        {
            timer1.Start();
        }
        
    }
}
